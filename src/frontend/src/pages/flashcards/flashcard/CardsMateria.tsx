import React, { useState, useEffect, useRef } from 'react'; // só adicionei useRef
import { useParams, useHistory } from 'react-router-dom';
import { IonPage, IonContent, IonButton, IonRow, IonLabel } from '@ionic/react'; // adicionei IonLabel para exibir tempo (opcional)
import './css/geral.css';
import './css/ui.css';
import './css/layouts.css';
import './css/darkmode.css';
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
  flashcard_id?: number;
}

interface Flashcard {
  id: number;
  titulo: string;
  materias?: string[];
  topico_id?: number;
}

interface Topico {
  id: number;
  materia_id: number;
}

interface TimeRecord {
  cardId?: number;
  timeSpent: number; 
  timestamp: Date;
}

const api = new API();

const CardsMateria: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const materiaId = Number(id);

  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [mostrarVerso, setMostrarVerso] = useState(false);
  const [respostas, setRespostas] = useState<string[]>([]);
  const [titulo, setTitulo] = useState('');
  const [materias, setMaterias] = useState<string[]>([]);

  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  const calculateTimeStats = () => {
  const totalTime = timeRecords.reduce((sum, record) => sum + record.timeSpent, 0);
  const averageTime = timeRecords.length > 0 ? totalTime / timeRecords.length : 0;
    return {
      totalTime,
      averageTime,
      totalCards: timeRecords.length
    };
  };

  const { playSomRespCerta, playSomRespErrada} = useSoundPlayer();

  useEffect(() => {
    console.log('Respostas atuais:', respostas);
  }, [respostas]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Iniciando busca para matéria ID:', materiaId);

        const topicosTodos: Topico[] = await api.get('topicos');
        const topicos = topicosTodos.filter(t => t.materia_id === materiaId);
        const topicoIds = topicos.map(t => t.id);


        if (topicoIds.length === 0) {
          console.warn('Nenhum tópico encontrado para a matéria');
          setCards([]);
          return;
        }

        const flashcards: Flashcard[] = await api.get('flashcards');
        console.log('Flashcards disponíveis:', flashcards.length);

        const flashcardsFiltrados = flashcards.filter(f => topicoIds.includes(f.topico_id ?? -1));
        const flashcardIds = flashcardsFiltrados.map(f => f.id);
        console.log('Flashcards da matéria:', flashcardIds);

        if (flashcardsFiltrados.length === 0) {
          console.warn('Nenhum flashcard corresponde à matéria');
          setCards([]);
          return;
        }

        setTitulo(`Matéria ID: ${materiaId}`);
        const materiasSet = new Set<string>();
        flashcardsFiltrados.forEach(f => f.materias?.forEach(m => materiasSet.add(m)));
        setMaterias(Array.from(materiasSet));

        const cardLists = await Promise.all(
          flashcardIds.map(fid => api.get(`cards?flashcard_id=${fid}`))
        );
        const todosCards = cardLists.flat();
        console.log('Cards filtrados da matéria:', todosCards.map(c => c.id));

        setCards(todosCards);
        setCurrentCardIndex(0);
        setMostrarVerso(false);
        setRespostas([]);

        setTimeRecords([]);
        setCurrentTime(0);
        startTimeRef.current = new Date();
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setCurrentTime(prev => prev + 1);
        }, 1000);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, [materiaId]);

  useEffect(() => {
    setMostrarVerso(false);
  }, [currentCardIndex]);

  useEffect(() => {
    if (cards.length === 0) return;

    if (startTimeRef.current && currentCardIndex > 0) {
      const now = new Date();
      const timeSpent = (now.getTime() - startTimeRef.current.getTime()) / 1000;
      const newRecord: TimeRecord = {
        cardId: cards[currentCardIndex - 1]?.id,
        timeSpent,
        timestamp: now
      };
      setTimeRecords(prev => [...prev, newRecord]);
    }

    startTimeRef.current = new Date();
    setCurrentTime(0);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentTime(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentCardIndex, cards]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const handleNextCard = async (nivel: string) => {
    const timeStats = calculateTimeStats();

    if (!mostrarVerso) return;

    if (nivel === 'muito fácil' || nivel === 'fácil') {
      playSomRespCerta();
    } else {
      playSomRespErrada();
    }

    try {
      if (cardAtual.id) {
        await api.put(`cards/${cardAtual.id}`, { nivel });
        console.log(`Registrado card ${cardAtual.id} como "${nivel}"`);
      }

      const novasRespostas = [...respostas, nivel];
      setRespostas(novasRespostas);

      const cardsAtualizados = cards.map((c, idx) =>
        idx === currentCardIndex ? { ...c, nivelResposta: nivel } : c
      );
      setCards(cardsAtualizados);

      if (startTimeRef.current) {
        const now = new Date();
        const timeSpent = (now.getTime() - startTimeRef.current.getTime()) / 1000;
        const newRecord: TimeRecord = {
          cardId: cardAtual.id,
          timeSpent,
          timestamp: now
        };
        setTimeRecords(prev => [...prev, newRecord]);
      }

      if (currentCardIndex + 1 < cards.length) {
        setCurrentCardIndex(currentCardIndex + 1);
        setMostrarVerso(false);
      } else {
        history.push('/flashcards/relatorio', {
          respostas: novasRespostas,
          cardsComRespostas: cardsAtualizados,
          nomeDeck: titulo,
          revisaoGeral: false,
          materias,
          timeStats: {
          totalTime: timeStats.totalTime,
          averageTime: timeStats.averageTime,
          timeRecords
          }
        });
      }
    } catch (error) {
      console.error('Erro ao avançar para o próximo card:', error);
    }
  };

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
            frente={
              <div style={{ padding: 20 }}>
                {cardAtual.conteudo_frente.map((item, i) => (
                  <div key={i}>
                    {item.tipo === 'texto' && <p>{item.valor}</p>}
                    {item.tipo === 'imagem' && (
                      <img src={item.valor} alt={`imagem-frente-${i}`} style={{ maxWidth: '100%' }} />
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
                    {item.tipo === 'texto' && <p>{item.valor}</p>}
                    {item.tipo === 'imagem' && (
                      <img src={item.valor} alt={`imagem-verso-${i}`} style={{ maxWidth: '100%' }} />
                    )}
                    {item.tipo === 'arquivo' && <p>Arquivo: {item.nome}</p>}
                  </div>
                ))}
              </div>
            }
            mostrarVerso={mostrarVerso}
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
            {niveis.map((nivel, index) => (
              <div
                key={index}
                className="emoji-botao"
                title={nivel.desc}
                onClick={() => handleNextCard(nivel.desc)}
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

export default CardsMateria;
