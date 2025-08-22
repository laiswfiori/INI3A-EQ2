import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
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
  flashcard_id?: number;
  conteudo_frente: { tipo: string; valor: string; nome?: string }[];
  conteudo_verso: { tipo: string; valor: string; nome?: string }[];
  nivelResposta?: string;
}

interface TimeRecord {
  cardId?: number;
  timeSpent: number;
  timestamp: Date;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const RevisaoGeral: React.FC = () => {
  const history = useHistory();
  const api = new API();

  const [allCards, setAllCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [mostrarVerso, setMostrarVerso] = useState(false);
  const [respostasAcumuladas, setRespostasAcumuladas] = useState<{ cardId: number; nivel: string }[]>([]);
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [currentTime, setCurrentTime] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const didFetch = useRef(false);

  const { playSomRespCerta, playSomRespErrada } = useSoundPlayer();

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    const fetchData = async () => {
      try {
        const flashcards = await api.get('flashcards');

        const allCardsFetched: Card[] = (
          await Promise.all(
            flashcards.map(async (f: any) => {
              const cards: Card[] = await api.get(`cards?flashcard_id=${f.id}`);
              return cards;
            })
          )
        ).flat();

        const shuffled = shuffleArray(allCardsFetched);

        setAllCards(shuffled);
        setCurrentCardIndex(0);
        setMostrarVerso(false);
        setRespostasAcumuladas([]);
        setTimeRecords([]);
        setCurrentTime(0);

        startTimeRef.current = new Date();
        timerRef.current = setInterval(() => {
          setCurrentTime(prev => prev + 1);
        }, 1000);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (startTimeRef.current && currentCardIndex > 0) {
      const now = new Date();
      const timeSpent = (now.getTime() - startTimeRef.current.getTime()) / 1000;

      const prevCard = allCards[currentCardIndex - 1];
      if (prevCard?.id) {
        setTimeRecords(prev => [...prev, { cardId: prevCard.id, timeSpent, timestamp: now }]);
      }
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
  }, [currentCardIndex]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  if (allCards.length === 0) {
    return (
      <IonPage>
        <Header />
        <IonContent className="pagFlashcards">
          <div className="loader-container"><div className="loader"></div></div>
        </IonContent>
      </IonPage>
    );
  }

  const cardAtual = allCards[currentCardIndex];

  const niveis = [
    { desc: 'muito fácil', emoji: '😄', cor: '#1e7e34' },
    { desc: 'fácil', emoji: '😊', cor: '#28a745' },
    { desc: 'médio', emoji: '😐', cor: '#ffc107' },
    { desc: 'difícil', emoji: '😟', cor: '#fd7e14' },
    { desc: 'muito difícil', emoji: '😣', cor: '#dc3545' },
  ];

  const calculateTimeStats = () => {
    const totalTime = timeRecords.reduce((sum, record) => sum + record.timeSpent, 0);
    const averageTime = timeRecords.length > 0 ? totalTime / timeRecords.length : 0;
    return { totalTime, averageTime, totalCards: timeRecords.length };
  };

const handleNextCard = async (nivel: string) => {
  if (!mostrarVerso || !cardAtual || !cardAtual.id) return;

  try {
    await api.put(`cards/${cardAtual.id}`, { nivel });
  } catch (error) {
    console.error(`Erro ao salvar nível do card ${cardAtual.id}:`, error);
  }

  const novasRespostas = [...respostasAcumuladas, { cardId: cardAtual.id!, nivel }];

  setRespostasAcumuladas(novasRespostas);
  localStorage.setItem('flashcards_totalFeitos', String(novasRespostas.length));
  localStorage.setItem('flashcards_respostas', JSON.stringify(novasRespostas));

  setAllCards(prev =>
    prev.map(c => (c.id === cardAtual.id ? { ...c, nivelResposta: nivel } : c))
  );

  if (startTimeRef.current) {
    const now = new Date();
    const timeSpent = (now.getTime() - startTimeRef.current.getTime()) / 1000;
    setTimeRecords(prev => [...prev, { cardId: cardAtual.id!, timeSpent, timestamp: now }]);
  }

  if (currentCardIndex + 1 < allCards.length) {
    setCurrentCardIndex(currentCardIndex + 1);
    setMostrarVerso(false);
    return;
  }

  const timeStats = calculateTimeStats();

  history.push('/flashcards/relatorio', {
    respostas: novasRespostas.map(r => r.nivel),
    cardsComRespostas: allCards.map(c =>
      c.id === cardAtual.id ? { ...c, nivelResposta: nivel } : c
    ),
    nomeDeck: 'Revisão Geral',
    revisaoGeral: true,
    materias: [],
    timeStats: {
      totalTime: timeStats.totalTime,
      averageTime: timeStats.averageTime,
      timeRecords
    }
  });
};

  const handleEmojiClick = (nivel: string) => {
    if (nivel === 'muito fácil' || nivel === 'fácil') {
      playSomRespCerta();
    } else {
      playSomRespErrada();
    }
    handleNextCard(nivel);
  };

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
                onClick={() => handleEmojiClick(nivel.desc)}
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

export default RevisaoGeral;
