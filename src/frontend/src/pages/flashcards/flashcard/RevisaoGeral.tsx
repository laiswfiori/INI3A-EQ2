import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, IonContent, IonButton, IonRow } from '@ionic/react';
import './css/geral.css';
import './css/ui.css';
import './css/layouts.css';
import API from '../../../lib/api';
import CardFlip from '../components/CardFlip';
import Header from '../../../components/Header';
import { useSoundPlayer } from '../../../utils/Som';

interface Card {
  id?: number;
  flashcard_id?: number;
  conteudo_frente: { tipo: string; valor: string; nome?: string }[];
  conteudo_verso: { tipo: string; valor: string; nome?: string }[];
  nivelResposta?: string;
}

interface FlashcardData {
  id: number;
  titulo: string;
  materias?: string[];
  cards?: Card[];
}

const api = new API();

const RevisaoGeral: React.FC = () => {
  const history = useHistory();

  const [flashcardsList, setFlashcardsList] = useState<FlashcardData[]>([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);

  const [allCards, setAllCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [mostrarVerso, setMostrarVerso] = useState(false);
  const [respostasAcumuladas, setRespostasAcumuladas] = useState<{ cardId: number; nivel: string }[]>([]);

  const [flashcardTitulo, setFlashcardTitulo] = useState('');
  const [materias, setMaterias] = useState<string[]>([]);

  const { playSomRespCerta, playSomRespErrada} = useSoundPlayer();

  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    const fetchData = async () => {
      try {
        const flashcards: FlashcardData[] = await api.get('flashcards');

        if (flashcards.length === 0) {
          setFlashcardsList([]);
          setFlashcardTitulo('Nenhum flashcard disponível para revisão geral');
          setAllCards([]);
          return;
        }

        const flashcardsComCards = await Promise.all(
          flashcards.map(async (flashcard) => {
            const cards: Card[] = await api.get(`cards?flashcard_id=${flashcard.id}`);
            return { ...flashcard, cards };
          })
        );

        const todosCards = flashcardsComCards.flatMap(f => f.cards ?? []);

        setFlashcardsList(flashcardsComCards);
        setFlashcardTitulo(flashcardsComCards[0].titulo);
        setMaterias(flashcardsComCards[0].materias ?? []);
        setAllCards(todosCards);

        setCurrentFlashcardIndex(0);
        setCurrentCardIndex(0);
        setMostrarVerso(false);
        setRespostasAcumuladas([]);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setMostrarVerso(false);
  }, [currentCardIndex]);

  if (flashcardsList.length === 0) {
    return (
      <IonPage>
        <Header />
        <IonContent className="pagFlashcards">
          <div className="loader-container"><div className="loader"></div></div>
        </IonContent>
      </IonPage>
    );
  }

  const flashcardAtual = flashcardsList[currentFlashcardIndex];
  const cardsDoFlashcardAtual = allCards.filter(card => card.flashcard_id === flashcardAtual.id);

  if (cardsDoFlashcardAtual.length === 0) {
    return (
      <IonPage>
        <Header />
        <IonContent className="pagFlashcards">
          <div className="loader-container"><div className="loader"></div></div>
        </IonContent>
      </IonPage>
    );
  }

  const cardAtual = cardsDoFlashcardAtual[currentCardIndex];

  const niveis = [
    { desc: 'muito fácil', emoji: '😄', cor: '#1e7e34' },
    { desc: 'fácil', emoji: '😊', cor: '#28a745' },
    { desc: 'médio', emoji: '😐', cor: '#ffc107' },
    { desc: 'difícil', emoji: '😟', cor: '#fd7e14' },
    { desc: 'muito difícil', emoji: '😣', cor: '#dc3545' },
  ];

  const handleNextCardOrFlashcard = async (nivel: string) => {
    if (!mostrarVerso || !cardAtual || !cardAtual.id) return;

    try {
      await api.put(`cards/${cardAtual.id}`, { nivel });
    } catch (error) {
      console.error(`Erro ao salvar nível do card ${cardAtual.id}:`, error);
    }

    setRespostasAcumuladas(prev => [...prev, { cardId: cardAtual.id!, nivel }]);
    setAllCards(prev => prev.map(c => (c.id === cardAtual.id ? { ...c, nivelResposta: nivel } : c)));

    if (currentCardIndex + 1 < cardsDoFlashcardAtual.length) {
      setCurrentCardIndex(currentCardIndex + 1);
      setMostrarVerso(false);
      return;
    }

    const cardsAtualizados = allCards
      .map(c => (c.flashcard_id === flashcardAtual.id ? c : null))
      .filter(Boolean) as Card[];

    const pontuacaoTotal = cardsAtualizados.reduce((acc, card) => {
      switch (card.nivelResposta) {
        case 'muito fácil': return acc + 1;
        case 'fácil': return acc + 2;
        case 'médio': return acc + 3;
        case 'difícil': return acc + 4;
        case 'muito difícil': return acc + 5;
        default: return acc;
      }
    }, 0);

    const media = cardsAtualizados.length ? pontuacaoTotal / cardsAtualizados.length : 0;

    const nivelString =
      media <= 1.5 ? 'muito fácil' :
      media <= 2.5 ? 'fácil' :
      media <= 3.5 ? 'médio' :
      media <= 4.5 ? 'difícil' :
      'muito difícil';

    try {
      await api.put(`flashcards/${flashcardAtual.id}`, { nivel: nivelString });
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Erro ao salvar nível do flashcard:', error);
      }
    }

    if (currentFlashcardIndex + 1 < flashcardsList.length) {
      const proximoFlashcard = flashcardsList[currentFlashcardIndex + 1];
      setCurrentFlashcardIndex(currentFlashcardIndex + 1);
      setFlashcardTitulo(proximoFlashcard.titulo);
      setMaterias(proximoFlashcard.materias ?? []);
      setCurrentCardIndex(0);
      setMostrarVerso(false);
      return;
    }

    history.push('/flashcards/relatorio', {
      respostas: [...respostasAcumuladas, { cardId: cardAtual.id!, nivel }],
      cardsComRespostas: allCards.map(c => c.id === cardAtual.id ? { ...c, nivelResposta: nivel } : c),
      nomeDeck: 'Revisão Geral',
      revisaoGeral: true,
      materias: [],
    });
  };

  const handleEmojiClick = (nivel: string) => {
    if (nivel === 'muito fácil' || nivel === 'fácil') {
      playSomRespCerta();
    } else {
      playSomRespErrada();
    }
    handleNextCardOrFlashcard(nivel);
  };

  const handleRevelarResposta = () => {
    setMostrarVerso(true);
  };

  const handleVoltarFrente = () => {
    setMostrarVerso(false);
  };

  return (
    <IonPage>
      <Header />
      <IonContent className="pagFlashcards">
        {mostrarVerso && (
          <IonRow className="flexF" style={{ marginBottom: '10px' }}>
            <IonButton expand="block" onClick={handleVoltarFrente} className="btnVerso">
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
            <IonButton expand="block" onClick={handleRevelarResposta} className="btnVerso">
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
  );
};

export default RevisaoGeral;
