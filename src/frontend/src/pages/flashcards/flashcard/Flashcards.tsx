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

interface FlashcardData {
  id: number;
  titulo: string;
  materias?: string[];
}

interface Topico {
  id: number;
  materia_id: number;
}

const api = new API();

const CardsMateria: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const materiaId = id ? Number(id) : NaN;
  const isIdValido = !isNaN(materiaId);

  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [mostrarVerso, setMostrarVerso] = useState(false);
  const [respostas, setRespostas] = useState<string[]>([]);
  const [materias, setMaterias] = useState<string[]>([]);
  const [tituloDeck, setTituloDeck] = useState('Estudo por Matéria');

  useEffect(() => {
    const fetchCardsMateria = async () => {
      try {
        if (!isIdValido) return;

        // Busca os tópicos dessa matéria
        const topicos: Topico[] = await api.get(`topicos?materia_id=${materiaId}`);
        const topicoIds = topicos.map(t => t.id);

        // Busca todos os flashcards
        const flashcards: FlashcardData[] = await api.get('flashcards');
        const flashcardsDaMateria = flashcards.filter(f => topicoIds.includes((f as any).topico_id));
        const flashcardIds = flashcardsDaMateria.map(f => f.id);

        // Busca e junta todos os cards desses flashcards
        const cardsTotais: Card[] = [];

        for (const id of flashcardIds) {
          const cardsDoFlash = await api.get(`flashcards/${id}/cards`);
          cardsTotais.push(...cardsDoFlash);
        }

        setCards(cardsTotais);
        setCurrentCardIndex(0);
        setMostrarVerso(false);
        setRespostas([]);
        setMaterias([String(materiaId)]);
      } catch (err) {
        console.error('Erro ao carregar cards da matéria:', err);
      }
    };

    fetchCardsMateria();
  }, [id]);

  useEffect(() => {
    setMostrarVerso(false);
  }, [currentCardIndex]);

  if (!isIdValido) {
    return (
      <IonPage>
        <Header />
        <IonContent className="pagFlashcards">
          <p>ID da matéria inválido.</p>
        </IonContent>
      </IonPage>
    );
  }

  if (cards.length === 0) {
    return (
      <IonPage>
        <Header />
        <IonContent className="pagFlashcards">
          <p>Carregando cards da matéria...</p>
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
    if (!mostrarVerso) return;
    if (!cardAtual?.id) return;

    try {
      await api.put(`cards/${cardAtual.id}`, { nivel });
    } catch (error) {
      console.error('Erro ao salvar nível do card:', error);
    }

    const novasRespostas = [...respostas, nivel];
    setRespostas(novasRespostas);
    setCards(prev =>
      prev.map((card, idx) =>
        idx === currentCardIndex ? { ...card, nivelResposta: nivel } : card
      )
    );

    if (currentCardIndex + 1 < cards.length) {
      setCurrentCardIndex(currentCardIndex + 1);
      setMostrarVerso(false);
      return;
    }

    // fim da revisão — calcula nível médio
    const total = cards.reduce((acc, card) => {
      switch (card.nivelResposta) {
        case 'muito fácil': return acc + 1;
        case 'fácil': return acc + 2;
        case 'médio': return acc + 3;
        case 'difícil': return acc + 4;
        case 'muito difícil': return acc + 5;
        default: return acc;
      }
    }, 0);

    const media = cards.length ? total / cards.length : 0;
    const nivelFinal =
      media <= 1.5 ? 'muito fácil' :
      media <= 2.5 ? 'fácil' :
      media <= 3.5 ? 'médio' :
      media <= 4.5 ? 'difícil' :
      'muito difícil';

    // sem PUT em flashcards, pois estamos lidando com múltiplos

    history.push('/flashcards/relatorio', {
      respostas: novasRespostas,
      cardsComRespostas: cards.map((c, idx) =>
        idx === currentCardIndex ? { ...c, nivelResposta: nivel } : c
      ),
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

export default CardsMateria;
