import React, { useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { IonPage, IonContent, IonButton, IonRow, IonLabel } from '@ionic/react';
import './css/geral.css';
import './css/ui.css';
import './css/layouts.css';
import API from '../../../lib/api';
import CardFlip from '../components/CardFlip';
import Header from '../../../components/Header';
import { useSoundPlayer } from '../../../utils/Som';
import ThemeManager from '../../../utils/ThemeManager';
import '../../../utils/css/variaveisCores.css';

interface Card {
  id?: number;
  conteudo_frente: { tipo: string; valor: string; nome?: string }[];
  conteudo_verso: { tipo: string; valor: string; nome?: string }[];
  nivelResposta?: string;
}

interface Flashcard {
  id: number;
  titulo: string;
  materias?: string[];
}

interface TimeRecord {
  cardId?: number;
  timeSpent: number; 
  timestamp: Date;
}

const api = new API();

const Flashcards: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const flashcardId = id ? Number(id) : NaN;
  const isIdValido = !isNaN(flashcardId);

  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [mostrarVerso, setMostrarVerso] = useState(false);
  const [respostas, setRespostas] = useState<string[]>([]);
  const [tituloDeck, setTituloDeck] = useState('Estudo');
  const [materias, setMaterias] = useState<string[]>([]);
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  const { playSomRespCerta, playSomRespErrada } = useSoundPlayer();

  // Função para iniciar o timer de um card
  const startCardTimer = () => {
    startTimeRef.current = new Date();
    setCurrentTime(0);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setCurrentTime(prev => prev + 1);
    }, 1000);
  };

  // Função para parar o timer e calcular o tempo gasto
  const stopCardTimer = (): number => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!startTimeRef.current) return 0;
    
    const now = new Date();
    const timeSpent = (now.getTime() - startTimeRef.current.getTime()) / 1000;
    return timeSpent;
  };

  useEffect(() => {
    const fetchCards = async () => {
      if (!isIdValido) return;

      try {
        const flashcard: Flashcard = await api.get(`flashcards/${flashcardId}`);
        const cardsDoFlash: Card[] = await api.get(`cards?flashcard_id=${flashcardId}`);

        setTituloDeck(flashcard.titulo || 'Estudo');
        setMaterias(flashcard.materias || []);
        setCards(cardsDoFlash);
        setCurrentCardIndex(0);
        setMostrarVerso(false);
        setRespostas([]);
        setTimeRecords([]);
        setCurrentTime(0);
        
        // Inicia o timer para o primeiro card após carregar
        if (cardsDoFlash.length > 0) {
          setTimeout(() => startCardTimer(), 100);
        }
      } catch (err) {
        console.error('Erro ao carregar flashcard ou cards:', err);
      }
    };

    fetchCards();
  }, [flashcardId]);

  // Effect para mudança de card
  useEffect(() => {
    if (cards.length === 0) return;

    // Para o timer do card anterior e salva o tempo se não for o primeiro card
    if (currentCardIndex > 0) {
      const timeSpent = stopCardTimer();
      
      const newRecord: TimeRecord = {
        cardId: cards[currentCardIndex - 1]?.id,
        timeSpent,
        timestamp: new Date()
      };
      
      setTimeRecords(prev => [...prev, newRecord]);
    }

    // Inicia o timer para o novo card
    setTimeout(() => startCardTimer(), 100);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentCardIndex]);

  // Effect para resetar o verso quando muda de card
  useEffect(() => {
    setMostrarVerso(false);
  }, [currentCardIndex]);

  // Cleanup do timer quando o componente desmonta
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const calculateTimeStats = () => {
    const totalTime = timeRecords.reduce((sum, record) => sum + record.timeSpent, 0);
    const averageTime = timeRecords.length > 0 ? totalTime / timeRecords.length : 0;
    
    return {
      totalTime,
      averageTime,
      totalCards: timeRecords.length
    };
  };

  const handleResponder = async (nivel: string) => {
    if (!mostrarVerso || !cards[currentCardIndex]?.id) return;
  
    if (nivel === 'muito fácil' || nivel === 'fácil') {
      playSomRespCerta();
    } else {
      playSomRespErrada();
    }
  
    try {
      await api.put(`cards/${cards[currentCardIndex].id}`, { nivel });
    } catch (error) {
      console.error('Erro ao salvar nível do card:', error);
    }
  
    const novasRespostas = [...respostas, nivel];
    const cardsAtualizados = cards.map((c, i) =>
      i === currentCardIndex ? { ...c, nivelResposta: nivel } : c
    );
    setRespostas(novasRespostas);
    setCards(cardsAtualizados);
  
    const respostasSalvas = localStorage.getItem('flashcards_respostas');
    const respostasAcumuladas = respostasSalvas ? JSON.parse(respostasSalvas) : [];
  
    const novasRespostasAcumuladas = [
      ...respostasAcumuladas,
      {
        flashcard_id: cards[currentCardIndex]?.flashcard_id,
        cardId: cards[currentCardIndex]?.id,
        nivel
      }
    ];
  
    localStorage.setItem('flashcards_respostas', JSON.stringify(novasRespostasAcumuladas));
    localStorage.setItem('flashcards_totalFeitos', String(novasRespostasAcumuladas.length));
  
    // Se não é o último card, vai para o próximo
    if (currentCardIndex + 1 < cards.length) {
      setCurrentCardIndex(currentCardIndex + 1);
      setMostrarVerso(false);
      return;
    }

    // É o último card - para o timer e calcula o tempo final
    const finalTimeSpent = stopCardTimer();
    const finalTimeRecord: TimeRecord = {
      cardId: cards[currentCardIndex]?.id,
      timeSpent: finalTimeSpent,
      timestamp: new Date()
    };
    
    const updatedTimeRecords = [...timeRecords, finalTimeRecord];
  
    // Calcula o nível final do flashcard
    const total = cardsAtualizados.reduce((acc, c) => {
      switch (c.nivelResposta) {
        case 'muito fácil': return acc + 1;
        case 'fácil': return acc + 2;
        case 'médio': return acc + 3;
        case 'difícil': return acc + 4;
        case 'muito difícil': return acc + 5;
        default: return acc;
      }
    }, 0);
  
    const media = cardsAtualizados.length ? total / cardsAtualizados.length : 0;
    const nivelFinal =
      media <= 1.5 ? 'muito fácil' :
      media <= 2.5 ? 'fácil' :
      media <= 3.5 ? 'médio' :
      media <= 4.5 ? 'difícil' : 'muito difícil';
  
    try {
      await api.put(`flashcards/${flashcardId}`, { nivel: nivelFinal });
    } catch (err) {
      console.error('Erro ao salvar nível geral do flashcard:', err);
    }
  
    // Calcula as estatísticas finais de tempo
    const timeStats = {
      totalTime: updatedTimeRecords.reduce((sum, r) => sum + r.timeSpent, 0),
      averageTime: updatedTimeRecords.length > 0
        ? updatedTimeRecords.reduce((sum, r) => sum + r.timeSpent, 0) / updatedTimeRecords.length
        : 0,
      timeRecords: updatedTimeRecords
    };
  
    // Navega para o relatório
    history.replace('/flashcards/relatorio', {
      respostas: novasRespostas,
      cardsComRespostas: cardsAtualizados,
      nomeDeck: tituloDeck,
      revisaoGeral: false,
      materias,
      timeStats
    });
  };

  const [noAnim, setNoAnim] = useState(false);

  useEffect(() => {
    setMostrarVerso(false);
    setNoAnim(true);
    const id = requestAnimationFrame(() => setNoAnim(false));
    return () => cancelAnimationFrame(id);
  }, [currentCardIndex]);
  

  if (!isIdValido) {
    return (
      <IonPage>
        <Header />
        <IonContent className="pagFlashcards">
          <p>ID do flashcard inválido.</p>
        </IonContent>
      </IonPage>
    );
  }

  if (cards.length === 0) {
    return (
      <IonPage>
        <Header />
        <IonContent className="pagFlashcards">
          <div className="loader-container"><div className="loader"></div></div>
        </IonContent>
      </IonPage>
    );
  }

  const cardAtual = cards[currentCardIndex];

  const niveis = [
    { desc: 'muito fácil', emoji: '😄', cor: '#1e7e34' },
    { desc: 'fácil', emoji: '😊', cor: '#28a745' },
    { desc: 'médio', emoji: '😐', cor: '#ffc107' },
    { desc: 'difícil', emoji: '😟', cor: '#fd7e14' },
    { desc: 'muito difícil', emoji: '😣', cor: '#dc3545' },
  ];

  return (
    <>
    <ThemeManager />
    <IonPage>
      <Header />
      <IonContent className="pagFlashcards">
        <div className="time-display">
          <IonLabel>Tempo no card: {formatTime(currentTime)}</IonLabel>
        </div>

        {mostrarVerso && (
          <IonRow className="flexF" style={{ marginBottom: '10px' }}>
            <IonButton expand="block" onClick={() => setMostrarVerso(false)} className="btnVerso">
              Voltar para a Frente
            </IonButton>
          </IonRow>
        )}

        <IonRow className="contF">
          <CardFlip
            key={cardAtual.id ?? currentCardIndex}
            frente={
              <div style={{ padding: 20 }}>
                {cardAtual.conteudo_frente.map((item, i) => (
                  <div key={i}>
                    {item.tipo === 'texto' && (
                      <p dangerouslySetInnerHTML={{ __html: item.valor }} />
                    )}
                    {item.tipo === 'imagem' && (
                      <img src={item.valor} alt={`img-frente-${i}`} style={{ maxWidth: '100%' }} />
                    )}
                    {item.tipo === 'arquivo' && <p>Arquivo: {item.nome}</p>}
                  </div>
                ))}
              </div>
            }
            verso={
              <div style={{ padding: 20 }}>
                {cardAtual.conteudo_verso.map((item, i) => (
                  <div key={i}>
                    {item.tipo === 'texto' && (
                      <p dangerouslySetInnerHTML={{ __html: item.valor }} />
                    )}
                    {item.tipo === 'imagem' && (
                      <img src={item.valor} alt={`img-verso-${i}`} style={{ maxWidth: '100%' }} />
                    )}
                    {item.tipo === 'arquivo' && <p>Arquivo: {item.nome}</p>}
                  </div>
                ))}
              </div>
            }
            mostrarVerso={mostrarVerso}
            noAnim={noAnim}
          />
        </IonRow>

        {!mostrarVerso && (
          <IonRow className="flexF">
            <IonButton expand="block" onClick={() => setMostrarVerso(true)} className="btnVerso">
              Revelar a resposta
            </IonButton>
          </IonRow>
        )}

        {mostrarVerso && (
          <IonRow className="emoji-botoes">
            {niveis.map((nivel, idx) => (
              <div
                key={idx}
                className="emoji-botao"
                title={nivel.desc}
                onClick={() => handleResponder(nivel.desc)}
                style={{ '--cor-emoji': nivel.cor } as React.CSSProperties}
              >
                {nivel.emoji}
              </div>
            ))}
          </IonRow>
        )}
      </IonContent>
    </IonPage>
    </>
  );
};

export default Flashcards;