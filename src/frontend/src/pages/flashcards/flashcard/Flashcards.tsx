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
        setCards(cardsData);
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

  const handleEmojiClick = (nivel: string) => {
    if (!mostrarVerso) return;

    const novasRespostas = [...respostas, nivel];
    setRespostas(novasRespostas);

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(currentIndex + 1);
      setMostrarVerso(false);
    } else {
      history.push('/flashcards/relatorio', { respostas: novasRespostas });
    }
  };

  const handleRevelarResposta = () => {
    setMostrarVerso(true);  
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
