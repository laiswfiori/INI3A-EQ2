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
import { getUserProfile } from '../../../lib/endpoints';

// Interfaces
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

// Função para embaralhar o array
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
  const [respostasAcumuladas, setRespostasAcumuladas] = useState<{ cardId: number; nivel: string, flashcard_id?: number }[]>([]);
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [noAnim, setNoAnim] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const didFetch = useRef(false);

  const { playSomRespCerta, playSomRespErrada } = useSoundPlayer();

  // Efeito para buscar os dados iniciais
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    const fetchData = async () => {
      try {
        const user = await getUserProfile();
        const userId = user.id;

        const [flashcards, topicos, materias] = await Promise.all([
          api.get('flashcards'),
          api.get('topicos'),
          api.get('materias')
        ]);

        const userFlashcards = flashcards.filter((f: any) => {
          const topico = topicos.find((t: any) => t.id === f.topico_id);
          if (!topico) return false;
          const materia = materias.find((m: any) => m.id === topico.materia_id);
          return materia && materia.usuario_id === userId;
        });

        if (userFlashcards.length === 0) {
            setAllCards([]); // Define como vazio para mostrar mensagem ou loader
            return;
        }

        const allCardsFetched: Card[] = (
          await Promise.all(
            userFlashcards.map(async (f: any) => {
              const cards: Card[] = await api.get(`cards?flashcard_id=${f.id}`);
              // Adiciona o flashcard_id a cada card para uso posterior
              return cards.map(card => ({ ...card, flashcard_id: f.id }));
            })
          )
        ).flat();

        const shuffled = shuffleArray(allCardsFetched);

        setAllCards(shuffled);
        // Reset de todos os estados para uma nova sessão
        setCurrentCardIndex(0);
        setMostrarVerso(false);
        setRespostasAcumuladas([]);
        setTimeRecords([]);
        setCurrentTime(0);

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  // Efeito para gerenciar o timer do card atual
  useEffect(() => {
    // Limpa qualquer timer anterior
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Inicia um novo timer e um novo marco de tempo
    startTimeRef.current = new Date();
    setCurrentTime(0);
    
    timerRef.current = setInterval(() => {
      setCurrentTime(prev => prev + 1);
    }, 1000);

    // Função de limpeza para quando o componente desmontar ou o card mudar
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentCardIndex]);

  // Efeito para resetar a animação do flip a cada novo card
  useEffect(() => {
    setMostrarVerso(false);
    setNoAnim(true);
    const id = requestAnimationFrame(() => setNoAnim(false));
    return () => cancelAnimationFrame(id);
  }, [currentCardIndex]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };
  
  // Exibição de loader enquanto os cards não carregam
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
    const finalTimeRecords = timeRecords;
    if (startTimeRef.current && cardAtual?.id) {
        const now = new Date();
        const timeSpent = (now.getTime() - startTimeRef.current.getTime()) / 1000;
        finalTimeRecords.push({ cardId: cardAtual.id, timeSpent, timestamp: now });
    }

    const totalTime = finalTimeRecords.reduce((sum, record) => sum + record.timeSpent, 0);
    const averageTime = finalTimeRecords.length > 0 ? totalTime / finalTimeRecords.length : 0;
    return { totalTime, averageTime, timeRecords: finalTimeRecords };
  };

  const handleNextCard = async (nivel: string) => {
    if (!mostrarVerso || !cardAtual || !cardAtual.id) return;

    // Atualiza o nível do card individual no backend
    try {
      await api.put(`cards/${cardAtual.id}`, { nivel });
    } catch (error) {
      console.error(`Erro ao salvar nível do card ${cardAtual.id}:`, error);
    }
    
    // CORREÇÃO 1: A nova resposta agora inclui o flashcard_id para a lógica final
    const novasRespostas = [...respostasAcumuladas, { cardId: cardAtual.id!, nivel, flashcard_id: cardAtual.flashcard_id }];
    setRespostasAcumuladas(novasRespostas);
    localStorage.setItem('flashcards_totalFeitos', String(novasRespostas.length));
    localStorage.setItem('flashcards_respostas', JSON.stringify(novasRespostas));

    // Cria a lista de cards com a resposta atualizada
    const cardsAtualizados = allCards.map(c =>
      c.id === cardAtual.id ? { ...c, nivelResposta: nivel } : c
    );
    setAllCards(cardsAtualizados);

    // CORREÇÃO 2: Lógica de tempo centralizada e corrigida
    if (startTimeRef.current) {
        const now = new Date();
        const timeSpent = (now.getTime() - startTimeRef.current.getTime()) / 1000;
        setTimeRecords(prev => [...prev, { cardId: cardAtual.id!, timeSpent, timestamp: now }]);
    }
    
    // Avança para o próximo card, se houver
    if (currentCardIndex + 1 < allCards.length) {
      setCurrentCardIndex(currentCardIndex + 1);
      return;
    }

    // --- ADIÇÃO 3: LÓGICA FINAL PARA ATUALIZAR OS DECKS ---
    // Agrupa os cards por flashcard_id
    const cardsAgrupados = cardsAtualizados.reduce((acc, card) => {
        const id = card.flashcard_id!;
        if (!acc[id]) {
          acc[id] = [];
        }
        acc[id].push(card);
        return acc;
    }, {} as Record<number, Card[]>);

    // Prepara e executa as atualizações de nível para cada deck
    const promisesDeAtualizacao = Object.entries(cardsAgrupados).map(async ([flashcardId, cardsDoGrupo]) => {
      const total = cardsDoGrupo.reduce((acc, c) => {
        if (!c.nivelResposta) return acc;
        switch (c.nivelResposta) {
          case 'muito fácil': return acc + 1;
          case 'fácil': return acc + 2;
          case 'médio': return acc + 3;
          case 'difícil': return acc + 4;
          case 'muito difícil': return acc + 5;
          default: return acc;
        }
      }, 0);

      const media = cardsDoGrupo.length ? total / cardsDoGrupo.length : 0;
      const nivelFinal =
        media <= 1.5 ? 'muito fácil' :
        media <= 2.5 ? 'fácil' :
        media <= 3.5 ? 'médio' :
        media <= 4.5 ? 'difícil' : 'muito difícil';

      try {
        await api.put(`flashcards/${flashcardId}`, { nivel: nivelFinal });
      } catch (err) {
        console.error(`Erro ao salvar nível do flashcard ${flashcardId}:`, err);
      }
    });

    await Promise.all(promisesDeAtualizacao);
    // --- FIM DA LÓGICA DE ATUALIZAÇÃO ---

    // Navega para a página de relatório
    const timeStats = calculateTimeStats();
    history.push('/flashcards/relatorio', {
      respostas: novasRespostas.map(r => r.nivel),
      // CORREÇÃO 4: Passa a variável correta com todas as respostas
      cardsComRespostas: cardsAtualizados,
      nomeDeck: 'Revisão Geral',
      revisaoGeral: true,
      materias: [], // Você pode querer popular isso com base nos cards revisados
      timeStats: timeStats // Passa o objeto completo de estatísticas
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
            key={cardAtual.id ?? currentCardIndex}
            frente={
              <div style={{ padding: 20 }}>
                {cardAtual.conteudo_frente.map((item, i) => (
                  <div key={i}>
                    {item.tipo === 'texto' && <p dangerouslySetInnerHTML={{ __html: item.valor }} />}
                    {item.tipo === 'imagem' && <img src={item.valor} alt={`imagem-frente-${i}`} style={{ maxWidth: '100%' }} />}
                    {item.tipo === 'arquivo' && <p>Arquivo: {item.nome}</p>}
                  </div>
                ))}
              </div>
            }
            verso={
              <div style={{ padding: 20 }}>
                {cardAtual.conteudo_verso.map((item, i) => (
                  <div key={i}>
                    {item.tipo === 'texto' && <p dangerouslySetInnerHTML={{ __html: item.valor }} />}
                    {item.tipo === 'imagem' && <img src={item.valor} alt={`imagem-verso-${i}`} style={{ maxWidth: '100%' }} />}
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