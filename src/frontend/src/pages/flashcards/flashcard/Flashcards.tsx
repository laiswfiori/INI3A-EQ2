import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
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
  conteudo_frente: { tipo: string; valor: string; nome?: string }[];
  conteudo_verso: { tipo: string; valor: string; nome?: string }[];
  nivelResposta?: string;
}

interface Flashcard {
  id: number;
  titulo: string;
  materias?: string[];
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

  const { playSomRespCerta, playSomRespErrada } = useSoundPlayer();

  useEffect(() => {
    const fetchCards = async () => {
      if (!isIdValido) return;

      try {
        const flashcard: Flashcard = await api.get(`flashcards/${flashcardId}`);
        const cardsDoFlash: Card[] = await api.get(`flashcards/${flashcardId}/cards`);

        setTituloDeck(flashcard.titulo || 'Estudo');
        setMaterias(flashcard.materias || []);
        setCards(cardsDoFlash);
        setCurrentCardIndex(0);
        setMostrarVerso(false);
        setRespostas([]);
      } catch (err) {
        console.error('Erro ao carregar flashcard ou cards:', err);
      }
    };

    fetchCards();
  }, [flashcardId]);

  useEffect(() => {
    setMostrarVerso(false);
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

  const handleResponder = async (nivel: string) => {
    if (!mostrarVerso || !cardAtual?.id) return;

    if (nivel === 'muito fácil' || nivel === 'fácil') {
      playSomRespCerta();
    } else {
      playSomRespErrada();
    }

    try {
      await api.put(`cards/${cardAtual.id}`, { nivel });
    } catch (error) {
      console.error('Erro ao salvar nível do card:', error);
    }

    const novasRespostas = [...respostas, nivel];
    const cardsAtualizados = cards.map((c, i) =>
      i === currentCardIndex ? { ...c, nivelResposta: nivel } : c
    );

    setRespostas(novasRespostas);
    setCards(cardsAtualizados);

    if (currentCardIndex + 1 < cards.length) {
      setCurrentCardIndex(currentCardIndex + 1);
      setMostrarVerso(false);
      return;
    }

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

    history.push('/flashcards/relatorio', {
      respostas: novasRespostas,
      cardsComRespostas: cardsAtualizados,
      nomeDeck: tituloDeck,
      revisaoGeral: false,
      materias,
    });
  };

  return (
    <IonPage>
      <Header />
      <IonContent className="pagFlashcards">
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
                    {item.tipo === 'texto' && <p>{item.valor}</p>}
                    {item.tipo === 'imagem' && (
                      <img src={item.valor} alt={`img-verso-${i}`} style={{ maxWidth: '100%' }} />
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
  );
};

export default Flashcards;
