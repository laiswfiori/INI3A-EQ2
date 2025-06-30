import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { IonPage, IonContent, IonButton, IonRow } from '@ionic/react';
import './css/geral.css';
import './css/ui.css';
import './css/layouts.css';
import API from '../../../lib/api';
import CardFlip from '../components/CardFlip';
import Header from '../../../components/Header';

interface Card {
  id?: number;
  conteudo_frente: { tipo: string; valor: string; nome?: string }[];
  conteudo_verso: { tipo: string; valor: string; nome?: string }[];
  nivelResposta?: string; 
}

const api = new API();

const Flashcard: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const history = useHistory();
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mostrarVerso, setMostrarVerso] = useState(false);
  const [respostas, setRespostas] = useState<string[]>([]); 

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const cardsData: Card[] = await api.get(`flashcards/${id}/cards`);
        const initialCards = cardsData.map(card => ({ ...card, nivelResposta: card.nivelResposta || undefined }));
        setCards(initialCards);
        setMostrarVerso(false);  
        setCurrentIndex(0);    
      } catch (error) {
        console.error('Erro ao buscar cards:', error);
      }
    };

    fetchCards();
  }, [id]);

  useEffect(() => {
    setMostrarVerso(false);
  }, [currentIndex]);

  const handleEmojiClick = async (nivel: string) => {
    if (!mostrarVerso) return;

    const currentCard = cards[currentIndex];
    
    if (currentCard && typeof currentCard.id === 'number') {
      try {
        await api.put(`cards/${currentCard.id}`, { nivel: nivel }); 
      } catch (error) {
        console.error(`Erro ao salvar nível do card ${currentCard.id} no BD:`, error);
      }
    }

    const novasRespostas = [...respostas, nivel];
    setRespostas(novasRespostas);

    const cardsAtualizadosComNivel = cards.map((card, idx) =>
      idx === currentIndex ? { ...card, nivelResposta: nivel } : card
    );
    setCards(cardsAtualizadosComNivel);

    if (currentIndex + 1 < cardsAtualizadosComNivel.length) {
      setCurrentIndex(currentIndex + 1);
      setMostrarVerso(false);
    } else {
      const pontuacaoTotalFlashcard = cardsAtualizadosComNivel.reduce((acc, card) => {
        switch (card.nivelResposta) {
          case 'muito fácil': return acc + 1;
          case 'fácil': return acc + 2;
          case 'médio': return acc + 3;
          case 'difícil': return acc + 4;
          case 'muito difícil': return acc + 5;
          default: return acc;
        }
      }, 0);
      const mediaFlashcard = cardsAtualizadosComNivel.length ? pontuacaoTotalFlashcard / cardsAtualizadosComNivel.length : 0;

      const nivelFlashcardString =
        mediaFlashcard <= 1.5 ? 'muito fácil' : 
        mediaFlashcard <= 2.5 ? 'fácil' : 
        mediaFlashcard <= 3.5 ? 'médio' : 
        mediaFlashcard <= 4.5 ? 'difícil' : 
        'muito difícil'; 

      try {
        await api.put(`flashcards/${id}`, { nivel: nivelFlashcardString });
      } catch (error) {
        console.error(`Erro ao salvar nível do flashcard ${id} no BD:`, error);
      }

      history.push('/flashcards/relatorio', { respostas: novasRespostas, cardsComRespostas: cardsAtualizadosComNivel });
    }
  };

  const handleRevelarResposta = () => {
    setMostrarVerso(true);  
  };

  const handleVoltarFrente = () => {
    setMostrarVerso(false);
  };

  if (cards.length === 0) {
    return (
      <IonPage>
        <Header />
        <IonContent>
          <p>Carregando cards...</p>
        </IonContent>
      </IonPage>
    );
  }

  const cardAtual = cards[currentIndex];

  const niveis = [
    { desc: 'muito fácil', emoji: '😄', cor: '#1e7e34' },
    { desc: 'fácil', emoji: '😊', cor: '#28a745' },
    { desc: 'médio', emoji: '😐', cor: '#ffc107' },
    { desc: 'difícil', emoji: '😟', cor: '#fd7e14' },
    { desc: 'muito difícil', emoji: '😣', cor: '#dc3545' },
  ];

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
                      <img
                        src={item.valor}
                        alt={`imagem-frente-${i}`}
                        style={{ maxWidth: '100%' }}
                      />
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
                      <img
                        src={item.valor}
                        alt={`imagem-verso-${i}`}
                        style={{ maxWidth: '100%' }}
                      />
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
          <IonRow
            className="emoji-botoes"
          >
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

export default Flashcard;