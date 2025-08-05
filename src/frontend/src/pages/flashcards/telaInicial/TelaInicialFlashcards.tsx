import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { IonPage, IonContent, IonIcon, IonButton, IonGrid, IonRow, IonCol, IonLabel,
  IonPopover, IonModal, IonSelect, IonSelectOption, IonTextarea, useIonToast } from '@ionic/react';
import Header from '../../../components/Header';
import { alertCircle, school, close, layers, time, library, arrowForward, card, barChart, trash, pencil, flash, chevronDown } from 'ionicons/icons'; 
import './css/geral.css';
import './css/ui.css';
import './css/layouts.css';
import './css/pie.css';
import './css/darkmode.css';
import API from '../../../lib/api';
import CardEditor from '../components/CardEditor';
import { useIonViewWillEnter } from '@ionic/react';
import { useSoundPlayer } from '../../../utils/Som';
import { iconePorMateriaNome } from '../../conteudos/materias/Materias';
import ThemeManager from '../../../utils/ThemeManager';
import '../../../utils/css/variaveisCores.css';

interface Topico {
  id: number;
  titulo: string;
  materia_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  flashcards: Flashcard[]; 
}

interface Materia {
  id: number;
  nome: string;
  usuario_id: number;
  topicos: Topico[]; 
}

interface Flashcard {
  id: number;
  topico_id: number;
  titulo: string;
  cards: Card[];
}

interface Card {
  id?: number;
  conteudo_frente: ConteudoItem[];
  conteudo_verso: ConteudoItem[];
  flashcard_id?: number;
}

interface ConteudoItem {
  tipo: 'texto' | 'imagem' | 'arquivo';
  valor: string;
  nome?: string;
}

const api = new API();

const TelaInicialFlashcards: React.FC = () => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]); 
  const [materiaExpandidaId, setMateriaExpandidaId] = useState<number | null>(null);
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);
  const [popoverEvent, setPopoverEvent] = useState<any>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [novoFlashcardTitulo, setNovoFlashcardTitulo] = useState(''); 
  const [mostrarEstatisticas, setMostrarEstatisticas] = useState(true);
  const [modalMateriaSelecionada, setModalMateriaSelecionada] = useState<Materia | null>(null); 
  const [topicoSelecionadoParaNovoFlashcard, setTopicoSelecionadoParaNovoFlashcard] = useState<number | null>(null); 
  const [showCardEditor, setShowCardEditor] = useState(false);
  const [cardsTemp, setCardsTemp] = useState<Card[]>([]);
  const [flashcardIdParaEditar, setFlashcardIdParaEditar] = useState<number | null>(null);
  const [flashcardsComOpcoesAbertas, setFlashcardsComOpcoesAbertas] = useState<number[]>([]);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);
  const [cardEditorInitialFrente, setCardEditorInitialFrente] = useState<ConteudoItem[]>([]);
  const [cardEditorInitialVerso, setCardEditorInitialVerso] = useState<ConteudoItem[]>([]);

  const [iconesMaterias, setIconesMaterias] = useState<{ [key: number]: string }>({});

  const [coresMaterias, setCoresMaterias] = useState<{ [key: number]: string }>({});
  const { id: materiaId } = useParams<{ id: string }>();
  const [corMateria, setCorMateria] = useState<string | undefined>();

  useEffect(() => {
    const storedCores = localStorage.getItem('coresMaterias');
    if (storedCores) {
      const cores = JSON.parse(storedCores);
      console.log('Cores carregadas:', cores);
      setCoresMaterias(cores);
    }
  }, []);

  useEffect(() => {
    const iconesSalvos = localStorage.getItem('iconesMaterias');
    if (iconesSalvos) {
      setIconesMaterias(JSON.parse(iconesSalvos));
    }
  }, []);

  const { playSomIniciar } = useSoundPlayer();

  const history = useHistory();
  const [presentToast] = useIonToast();

  const fetchData = async () => {
  try {
    const [materiasDataRaw, topicosDataRaw, flashcardsDataRaw, cardsDataRaw] = await Promise.all([
      api.get('materias'),
      api.get('topicos'),
      api.get('flashcards'),
      api.get('cards'),
    ]);

    const materiasData = materiasDataRaw as Materia[];
    const topicosData = topicosDataRaw as Topico[];
    const flashcardsData = flashcardsDataRaw as Flashcard[];
    const cardsData = cardsDataRaw as Card[];

    const flashcardsComCards = flashcardsData.map((flashcard: Flashcard) => ({
      ...flashcard,
      cards: cardsData.filter((card: Card) => card.flashcard_id === flashcard.id),
    }));

    setMaterias(materiasData);
    setTopicos(topicosData);
    setFlashcards(flashcardsComCards);
    setCards(cardsData);

  } catch (error) {
    console.error('Erro ao buscar dados iniciais:', error);
    presentToast({
      message: 'Erro ao carregar dados. Tente novamente mais tarde.',
      duration: 3000,
      color: 'danger',
    });
  }
};

useIonViewWillEnter(() => {
  fetchData();
});

const filtrarFlashcardsDoUsuario = (
  materiasData: Materia[],
  topicosData: Topico[],
  flashcardsData: Flashcard[],
  cardsData: Card[]
): Flashcard[] => {
  const materiaIds = materiasData.map((m: Materia) => m.id);
  const topicoIds = topicosData
    .filter((t: Topico) => materiaIds.includes(t.materia_id))
    .map((t: Topico) => t.id);

  const flashcardsUsuario = flashcardsData.filter((f: Flashcard) =>
    topicoIds.includes(f.topico_id)
  );

  return flashcardsUsuario.map((f: Flashcard) => ({
    ...f,
    cards: cardsData.filter((c: Card) => c.flashcard_id === f.id),
  }));
};


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMostrarEstatisticas(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const carregarDadosParaEdicao = async () => {
      if (flashcardIdParaEditar !== null) {
        try {
          const flashcard = flashcards.find(f => f.id === flashcardIdParaEditar);
          if (flashcard) {
            setNovoFlashcardTitulo(flashcard.titulo);
            setTopicoSelecionadoParaNovoFlashcard(flashcard.topico_id);
            const cardsDoFlashcard = cards.filter(c => c.flashcard_id === flashcard.id);
            setCardsTemp(cardsDoFlashcard);
            const topicoDoFlashcard = topicos.find(t => t.id === flashcard.topico_id);
            if (topicoDoFlashcard) {
              const materiaDoTopico = materias.find(m => m.id === topicoDoFlashcard.materia_id);
              setModalMateriaSelecionada(materiaDoTopico || null);
            }
          }
        } catch (error) {
          console.error('Erro ao carregar dados do flashcard para edição:', error);
          presentToast({
            message: 'Erro ao carregar flashcard para edição.',
            duration: 3000,
            color: 'danger',
          });
          setFlashcardIdParaEditar(null);
        }
      } else {
        setNovoFlashcardTitulo('');
        setTopicoSelecionadoParaNovoFlashcard(null);
        setCardsTemp([]);
        setModalMateriaSelecionada(null);
      }
    };

    carregarDadosParaEdicao();
  }, [flashcardIdParaEditar, flashcards, cards, topicos, materias]);

  const toggleExpandirMateria = (materiaId: number) => {
    setMateriaExpandidaId(materiaExpandidaId === materiaId ? null : materiaId);
  };

  const handlePopoverClick = (e: React.MouseEvent) => {
    setPopoverEvent(e.nativeEvent);
    setPopoverVisible(true);
  };

  const closePopover = () => {
    setPopoverVisible(false);
  };

  const abrirModalCriarFlashcard = (materia: Materia) => {
    setFlashcardIdParaEditar(null);
    setNovoFlashcardTitulo('');
    setCardsTemp([]);
    setTopicoSelecionadoParaNovoFlashcard(null); 
    setModalMateriaSelecionada(materia);
    setShowModal(true);
  };

  const estudarTopico = (topicoId: number) => {
    history.push(`/flashcards/estudar/${topicoId}`);
  };

const handleSalvarOuAtualizarFlashcard = async (): Promise<void> => {
  if (!topicoSelecionadoParaNovoFlashcard || novoFlashcardTitulo.trim() === '') {
    presentToast({
      message: 'Preencha o título e selecione um tópico para o flashcard.',
      duration: 3000,
      color: 'warning',
    });
    return;
  }

  const hasValidContent = cardsTemp.some(card => 
    (card.conteudo_frente.some(item => item.tipo === 'texto' && item.valor.trim() !== '') || 
     card.conteudo_frente.some(item => item.tipo === 'imagem' && item.valor.trim() !== '')) &&
    (card.conteudo_verso.some(item => item.tipo === 'texto' && item.valor.trim() !== '') || 
     card.conteudo_verso.some(item => item.tipo === 'imagem' && item.valor.trim() !== ''))
  );

  if (!hasValidContent) {
    presentToast({
      message: 'Adicione pelo menos um card com conteúdo válido na frente e no verso (texto ou imagem).',
      duration: 3000,
      color: 'warning',
    });
    return;
  }

  try {
    if (flashcardIdParaEditar) {
      await api.put(`flashcards/${flashcardIdParaEditar}`, {
        titulo: novoFlashcardTitulo,
        topico_id: topicoSelecionadoParaNovoFlashcard,
      });

      const cardsExistentesDoFlashcard = cards.filter(c => c.flashcard_id === flashcardIdParaEditar);

      const cardsParaDeletar = cardsExistentesDoFlashcard.filter(
        existingCard => !cardsTemp.some(tempCard => tempCard.id === existingCard.id)
      );
      for (const card of cardsParaDeletar) {
        if (card.id) await api.delete(`cards/${card.id}`);
      }

      for (const card of cardsTemp) {
        const filteredFrente = card.conteudo_frente.filter(item => !(item.tipo === 'texto' && item.valor.trim() === ''));
        const filteredVerso = card.conteudo_verso.filter(item => !(item.tipo === 'texto' && item.valor.trim() === ''));

        const cardData = {
          flashcard_id: flashcardIdParaEditar,
          conteudo_frente: filteredFrente,
          conteudo_verso: filteredVerso,
        };

        if (card.id) {
          await api.put(`cards/${card.id}`, cardData);
        } else {
          await api.post('cards', cardData);
        }
      }

      presentToast({
        message: 'Flashcard atualizado com sucesso!',
        duration: 2000,
        color: 'success',
      });
    } else {
      const novoFlashcard = {
        topico_id: topicoSelecionadoParaNovoFlashcard,
        titulo: novoFlashcardTitulo,
      };

      const flashcardCriado: Flashcard = await api.post('flashcards', novoFlashcard);

      if (!flashcardCriado || !flashcardCriado.id) {
        throw new Error('ID do flashcard não retornado');
      }

      for (const card of cardsTemp) {
        const filteredFrente = card.conteudo_frente.filter(item => !(item.tipo === 'texto' && item.valor.trim() === ''));
        const filteredVerso = card.conteudo_verso.filter(item => !(item.tipo === 'texto' && item.valor.trim() === ''));

        await api.post('cards', {
          flashcard_id: flashcardCriado.id,
          conteudo_frente: filteredFrente,
          conteudo_verso: filteredVerso,
        });
      }

      presentToast({
        message: 'Flashcard criado com sucesso!',
        duration: 2000,
        color: 'success',
      });
    }

    await fetchData();
    setShowModal(false);
    setCardsTemp([]);
    setNovoFlashcardTitulo('');
    setTopicoSelecionadoParaNovoFlashcard(null);
    setFlashcardIdParaEditar(null);
    setEditingCardIndex(null);
    setCardEditorInitialFrente([]);
    setCardEditorInitialVerso([]);
  } catch (error) {
    console.error('Erro ao salvar/atualizar flashcard com cards:', error);
    presentToast({
      message: 'Erro ao salvar/atualizar flashcard.',
      duration: 3000,
      color: 'danger',
    });
  }
};


const deletarFlashcard = async (id: number): Promise<void> => {
  try {
    await api.delete(`flashcards/${id}`);

    presentToast({
      message: 'Flashcard deletado com sucesso!',
      duration: 2000,
      color: 'success',
    });

    await fetchData();
  } catch (error) {
    console.error('Erro ao deletar flashcard:', error);
    presentToast({
      message: 'Erro ao deletar flashcard.',
      duration: 3000,
      color: 'danger',
    });
  }
};

const abrirModalEditarFlashcard = (id: number) => {
  setFlashcardIdParaEditar(id);
  setShowModal(true);
};

const handleAddOrUpdateCardTemp = (conteudoFrente: ConteudoItem[], conteudoVerso: ConteudoItem[]) => {
  const newCard: Card = {
    conteudo_frente: conteudoFrente,
    conteudo_verso: conteudoVerso,
  };

  if (editingCardIndex !== null) {
    const updatedCards = [...cardsTemp];
    updatedCards[editingCardIndex] = { ...updatedCards[editingCardIndex], ...newCard };
    setCardsTemp(updatedCards);
  } else {
    setCardsTemp(prev => [...prev, newCard]);
  }
  setShowCardEditor(false);
  setEditingCardIndex(null);
  setCardEditorInitialFrente([]);
  setCardEditorInitialVerso([]);
};


const setShowCardEditorAndInitialData = (
  show: boolean,
  frente: ConteudoItem[] = [],
  verso: ConteudoItem[] = [],
  index: number | null = null
) => {
  setShowCardEditor(show);
  setCardEditorInitialFrente(frente);
  setCardEditorInitialVerso(verso);
  setEditingCardIndex(index);
};

  const removerCardTemp = (index: number) => {
    setCardsTemp(prev => prev.filter((_, i) => i !== index));
  };

  const toggleOpcoesFlashcard = (flashcardId: number) => {
    setFlashcardsComOpcoesAbertas((prev) =>
      prev.includes(flashcardId)
        ? prev.filter(id => id !== flashcardId)
        : [...prev, flashcardId]
    );
  };


  return (
    <>
    <ThemeManager />
    <IonPage className="pagina">
      <Header />
      <IonContent className="bodyFI">
        <IonGrid id="bodyTelaInicialFlashcards">
          <IonRow id="revisao">
            <IonCol id="dCapelo">
              <IonIcon icon={school} id="iconeCapelo" />
            </IonCol>
            <IonCol id="d1">
              <p className="txtGeral pDarkmode">Revisão do dia!</p>
              <IonButton className="revisaoGeral" onClick={() => {
                  playSomIniciar();   
                  history.push('/flashcard/revisaoGeral');
                }}>
                <span className="textIniciar">Iniciar</span>
                <span> <svg  className="svgIniciar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 15" fill="none">
                  <path fill="white" d="M10 7.519l-.939-.344h0l.939.344zm14.386-1.205l-.981-.192.981.192zm1.276 5.509l.537.843.148-.094.107-.139-.792-.611zm4.819-4.304l-.385-.923h0l.385.923zm7.227.707a1 1 0 0 0 0-1.414L31.343.448a1 1 0 0 0-1.414 0 1 1 0 0 0 0 1.414l5.657 5.657-5.657 5.657a1 1 0 0 0 1.414 1.414l6.364-6.364zM1 7.519l.554.833.029-.019.094-.061.361-.23 1.277-.77c1.054-.609 2.397-1.32 3.629-1.787.617-.234 1.17-.392 1.623-.455.477-.066.707-.008.788.034.025.013.031.021.039.034a.56.56 0 0 1 .058.235c.029.327-.047.906-.39 1.842l1.878.689c.383-1.044.571-1.949.505-2.705-.072-.815-.45-1.493-1.16-1.865-.627-.329-1.358-.332-1.993-.244-.659.092-1.367.305-2.056.566-1.381.523-2.833 1.297-3.921 1.925l-1.341.808-.385.245-.104.068-.028.018c-.011.007-.011.007.543.84zm8.061-.344c-.198.54-.328 1.038-.36 1.484-.032.441.024.94.325 1.364.319.45.786.64 1.21.697.403.054.824-.001 1.21-.09.775-.179 1.694-.566 2.633-1.014l3.023-1.554c2.115-1.122 4.107-2.168 5.476-2.524.329-.086.573-.117.742-.115s.195.038.161.014c-.15-.105.085-.139-.076.685l1.963.384c.192-.98.152-2.083-.74-2.707-.405-.283-.868-.37-1.28-.376s-.849.069-1.274.179c-1.65.43-3.888 1.621-5.909 2.693l-2.948 1.517c-.92.439-1.673.743-2.221.87-.276.064-.429.065-.492.057-.043-.006.066.003.155.127.07.099.024.131.038-.063.014-.187.078-.49.243-.94l-1.878-.689zm14.343-1.053c-.361 1.844-.474 3.185-.413 4.161.059.95.294 1.72.811 2.215.567.544 1.242.546 1.664.459a2.34 2.34 0 0 0 .502-.167l.15-.076.049-.028.018-.011c.013-.008.013-.008-.524-.852l-.536-.844.019-.012c-.038.018-.064.027-.084.032-.037.008.053-.013.125.056.021.02-.151-.135-.198-.895-.046-.734.034-1.887.38-3.652l-1.963-.384zm2.257 5.701l.791.611.024-.031.08-.101.311-.377 1.093-1.213c.922-.954 2.005-1.894 2.904-2.27l-.771-1.846c-1.31.547-2.637 1.758-3.572 2.725l-1.184 1.314-.341.414-.093.117-.025.032c-.01.013-.01.013.781.624zm5.204-3.381c.989-.413 1.791-.42 2.697-.307.871.108 2.083.385 3.437.385v-2c-1.197 0-2.041-.226-3.19-.369-1.114-.139-2.297-.146-3.715.447l.771 1.846z" />
                 </svg>
                </span>
              </IonButton>
            </IonCol>
            <IonCol id="d2">
              <IonButton id="btnAlerta" onClick={(e) => {
                setPopoverEvent(e.nativeEvent);
                setPopoverVisible(true);
              }}>
                <IonIcon icon={alertCircle} id="iconeAlerta" />
              </IonButton>
              <IonPopover
                isOpen={popoverVisible}
                event={popoverEvent}
                onDidDismiss={closePopover}
                className="popoverGeral"
              >
                <div id="branco">
                  <IonButton onClick={closePopover} id="btnFechar">
                    <IonIcon icon={close} className="iconeFechar" />
                  </IonButton>
                  <p className="pDarkmode">
                    O modo de revisão geral apresenta todos os flashcards do dia que devem ser
                    revisados (independente da matéria), para que você possa treinar todas as
                    matérias!
                  </p>
                </div>
              </IonPopover>
            </IonCol>
            <IonCol className="colFlex">
              <svg viewBox="0 0 250 250" className="circular-progress">
                <circle
                  className="bg"
                  cx="125"
                  cy="125"
                  r="115"
                  fill="none"
                  stroke="#ddd"
                  strokeWidth="20"
                />
                <circle
                  className="fg"
                  cx="125"
                  cy="125"
                  r="115"
                  fill="none"
                  stroke="#5394fd"
                  strokeWidth="20"
                  strokeDasharray="361.25 361.25"
                />
              </svg>
            </IonCol>
          </IonRow>
          <IonRow id="divisoes">
            <IonRow id="linhaDecks">
              <p id="pDecks">Decks atuais</p>
            </IonRow>
          </IonRow>
          {!mostrarEstatisticas && (
            <div className="botaoAbrirEstatisticas" onClick={() => setMostrarEstatisticas(true)}>
              <IonIcon icon={barChart} />
              <p className="pDarkmode">Mostrar estatísticas</p>
            </div>
          )}
          {mostrarEstatisticas && (
            <IonRow id="estatisticas">
              <div className="fecharMobile" onClick={() => setMostrarEstatisticas(false)}>
                <IonIcon icon={close} className="iconeFechar" />
                <p className="pDarkmode">Fechar estatísticas</p>
              </div>
              <div className="estDivs">
                <IonRow className="espDiv">
                  <IonCol className="altD">
                    <p className="txtGrande pDarkmode">{flashcards.length}</p> 
                  </IonCol>
                  <IonCol className="altD iconFim">
                    <IonIcon icon={layers} className="iconesTF" />
                  </IonCol>
                </IonRow>
                <IonRow>
                  <p className="txtTF pDarkmode">Total de flashcards</p>
                </IonRow>
              </div>

              <div className="estDivs">
                <IonRow className="espDiv">
                  <IonCol className="altD">
                    <p className="txtGrande pDarkmode">{materias.length}</p>
                  </IonCol>
                  <IonCol className="altD iconFim">
                    <IonIcon icon={library} className="iconesTF" />
                  </IonCol>
                </IonRow>
                <IonRow>
                  <p className="txtTF pDarkmode">Matérias para estudar</p>
                </IonRow>
              </div>

              <div className="estDivs">
                <IonRow className="espDiv">
                  <IonCol className="altD">
                    <p className="txtGrande pDarkmode">0</p> 
                  </IonCol>
                  <IonCol className="altD iconFim">
                    <IonIcon icon={time} className="iconesTF" />
                  </IonCol>
                </IonRow>
                <IonRow>
                  <p className="txtTF pDarkmode">Flashcards para revisar hoje</p>
                </IonRow>
              </div>
            </IonRow>
          )}
          <IonRow id="decks" className="p0">
            {materias.length > 0 ? (
              materias.map((materia) => {
                const topicosDaMateria = topicos.filter(t => t.materia_id === materia.id);
                const flashcardsDaMateria = flashcards.filter(f =>
                  topicosDaMateria.some(t => t.id === f.topico_id)
                );
                const totalCardsMateria = flashcardsDaMateria.reduce((total, flashcard) => {
                const numCards = Array.isArray(flashcard.cards) ? flashcard.cards.length : 0;
                  return total + numCards;}, 0
                );
                const cardsParaRevisarMateria = 0; 
                const progresso = totalCardsMateria > 0 ? (cardsParaRevisarMateria / totalCardsMateria) * 100 : 0;
                const estaExpandida = materiaExpandidaId === materia.id;

                return (
                  <IonCol key={materia.id} className="materia-itemF">
                    <IonLabel>
                      <IonRow className="containerMateria">
                        <IonRow className="rowIN">
                          <div>
                            {iconesMaterias[materia.id]?.startsWith('data:image') ? (
                            <img
                              src={iconesMaterias[materia.id]}
                              alt="Ícone da matéria"
                              className="imgMF"
                            />
                          ) : (() => {
                            const key = materia.nome.trim().toUpperCase();
                            const iconeData = iconePorMateriaNome[key];
                            return (
                              <IonIcon
                                icon={iconeData ? iconeData.icon : library}
                                className={iconeData ? iconeData.className : 'livroF'}
                                style={{ color: coresMaterias[materia.id] || '' }}
                              />
                            );
                          })()}
                          </div>
                          <IonCol className="td centro">
                            <h2 className="txtTitMat">{materia.nome}</h2>
                          </IonCol>
                          <IonCol className="iconFim">
                            <IonButton
                              id={`config-btn-${materia.id}`}
                              className="verTopicos"
                              onClick={() => toggleExpandirMateria(materia.id)}
                            >
                              {estaExpandida ? 'Esconder tópicos' : 'Ver tópicos'}
                            </IonButton>
                          </IonCol>
                        </IonRow>
                      </IonRow>
                      <IonRow className="espDC">
                        <p className="txtWC pDarkmode">{totalCardsMateria} cards</p>
                        <p className="txtWC" id="txtRevisar">{cardsParaRevisarMateria} para revisar</p>
                      </IonRow>
                      <IonRow className="barra">
                        <div className="barraStatus" style={{ width: `${progresso}%` }}></div>
                      </IonRow>
                      <IonRow className="larguraC">
                        <IonButton
                          id="btnEstudar"
                          onClick={(e) => {
                            e.stopPropagation();
                            playSomIniciar();   
                            history.push(`/flashcard/materia/${materia.id}`);
                          }}
                        >
                          Estudar
                        </IonButton>
                        <IonButton
                          id="btnMais"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            const temTopico = topicos.some((topico) => topico.materia_id === materia.id);

                            if (!temTopico) {
                              presentToast({
                                message: 'Você precisa criar um tópico antes de adicionar um flashcard.',
                                duration: 3000,
                                color: 'warning',
                              });
                              return;
                            }

                            abrirModalCriarFlashcard(materia);
                          }}
                        >
                          +
                      </IonButton>
                      </IonRow>
                    </IonLabel>

                    {estaExpandida && (
                      <div className="listaTopicos">
                        {(() => {
                          const topicosComFlashcardsNaMateria = topicosDaMateria.filter(topico =>
                            flashcards.some(f => f.topico_id === topico.id)
                          );

                          if (topicosComFlashcardsNaMateria.length > 0) {
                            return topicosComFlashcardsNaMateria.map(topico => {
                              const flashcardsDoTopico = flashcards.filter(f => f.topico_id === topico.id);

                              return (
                                <div key={topico.id} className="topico-com-flashcards">
                                  <IonRow className="contSetaTopico">
                                    <IonIcon icon={arrowForward} className="setaTopico" />
                                    <p className="txtTopico">{topico.titulo}</p>
                                  </IonRow>

                                  {flashcardsDoTopico.map(flashcard => (
                                    <IonRow key={flashcard.id} className="item-flashcard">
                                      <IonCol size="8">
                                        <p className="titulo-flashcard">{flashcard.titulo}</p>
                                        <p className="info-cards">
                                          {flashcard.cards?.length || 0} {flashcard.cards?.length === 1 ? 'card' : 'cards'}
                                        </p>
                                      </IonCol>
                                      <IonCol className="botoes-flashcard">
                                        <IonButton
                                          className={`pDarkmode btnFlash btnMostrar ${
                                            flashcardsComOpcoesAbertas.includes(flashcard.id) ? 'btnFecharOpcoes' : ''
                                          }`} 
                                          onClick={() => toggleOpcoesFlashcard(flashcard.id)}
                                        >
                                          <IonIcon
                                            icon={flashcardsComOpcoesAbertas.includes(flashcard.id) ? close : chevronDown}
                                            className="bntAbrirOp"
                                          />
                                          {flashcardsComOpcoesAbertas.includes(flashcard.id) ? 'Fechar opções' : 'Mostrar opções'}
                                        </IonButton>

                                        {flashcardsComOpcoesAbertas.includes(flashcard.id) && (
                                          <div className="grupoBotoesFlashcard">
                                            <IonButton onClick={() => {
                                              playSomIniciar();
                                              history.push(`/flashcard/${flashcard.id}`);
                                            }}
                                            className="btnFlash btnEstudar pDarkmode">
                                              <IonIcon icon={flash} className="iconesOpFlash btnEstudar" />
                                              Estudar
                                            </IonButton>

                                            <IonButton onClick={() => abrirModalEditarFlashcard(flashcard.id)} className="btnFlash btnEditar pDarkmode">
                                              <IonIcon icon={pencil} className="iconesOpFlash btnEditar" />
                                              Editar
                                            </IonButton>

                                            <IonButton onClick={() => deletarFlashcard(flashcard.id)} className="btnFlash btnExcluir pDarkmode">
                                              <IonIcon icon={trash} className="iconesOpFlash btnExcluir" />
                                              Excluir
                                            </IonButton>
                                          </div>
                                        )}
                                      </IonCol>
                                    </IonRow>
                                  ))}
                                </div>
                              );
                            });

                          } else {
                            return <p className="sem-topicos-aviso pDarkmode">Nenhum tópico com flashcards nesta matéria.</p>;
                          }
                        })()}
                      </div>
                    )}
                  </IonCol>
                );
              })
            ) : (
              <p>Nenhuma matéria disponível.</p>
            )}
          </IonRow>
        </IonGrid>

       <IonModal
          isOpen={showModal}
          onDidDismiss={() => {
            setShowModal(false);
            setFlashcardIdParaEditar(null);
            setShowCardEditor(false);
            setCardsTemp([]);
            setNovoFlashcardTitulo('');
            setTopicoSelecionadoParaNovoFlashcard(null);
          }}
          className="modalFlashcards"
        >
          <div className="modalConteudo scroll-modal">
            <IonRow className="contFecharModal">
              <IonIcon
                icon={close}
                className="iconeFecharM"
                onClick={() => {
                  setShowModal(false);
                  setFlashcardIdParaEditar(null);
                  setShowCardEditor(false);
                  setCardsTemp([]);
                  setNovoFlashcardTitulo('');
                  setTopicoSelecionadoParaNovoFlashcard(null);
                }}
              />
            </IonRow>

            {!showCardEditor && (
              <>
                <IonRow className="centroModal">
                  <h2 className="label pDarkmode">
                    {flashcardIdParaEditar ? 'Editar flashcard' : 'Criar novo flashcard'}
                  </h2>
                </IonRow>

                <IonSelect
                  value={topicoSelecionadoParaNovoFlashcard}
                  placeholder="Escolha o tópico"
                  onIonChange={(e) => setTopicoSelecionadoParaNovoFlashcard(e.detail.value)}
                  className="input iFlashcard pDarkmode"
                >
                  {topicos
                    .filter(t => t.materia_id === modalMateriaSelecionada?.id)
                    .map(topico => (
                      <IonSelectOption key={topico.id} value={topico.id}>
                        {topico.titulo}
                      </IonSelectOption>
                    ))}
                </IonSelect>

                <IonTextarea
                  labelPlacement="stacked"
                  placeholder="Digite o título do flashcard"
                  value={novoFlashcardTitulo}
                  onIonInput={(e) => setNovoFlashcardTitulo(e.detail.value!)}
                  className="input pDarkmode"
                />

                <IonRow className="centroModal">
                  <h3 className="pDarkmode">{flashcardIdParaEditar ? 'Editar cards' : 'Adicionar cards'}</h3>
                </IonRow>

                <IonButton
                  expand="block"
                  onClick={() => setShowCardEditorAndInitialData(true)}
                  className="btnAdicionarCard"
                >
                  {flashcardIdParaEditar ? 'Adicionar/Editar conteúdo do card' : 'Adicionar conteúdo do card'}
                </IonButton>

                {cardsTemp.length > 0 && (
                  <div className="listaCardsPreview">
                    <h4>{flashcardIdParaEditar ? 'Cards existentes:' : 'Cards adicionados:'}</h4>
                    {cardsTemp.map((card, index) => (
                      <div key={index} className="cardPreviewItem">
                        <div className="cardPreviewContent">
                          <IonRow className="rowRC">
                            <h5>Card {index + 1}</h5>
                            <IonCol className="colRC">
                              <IonButton
                                onClick={() => setShowCardEditorAndInitialData(true, card.conteudo_frente, card.conteudo_verso, index)}
                                className="btnEditarCard"
                              >
                                Editar
                              </IonButton>
                              <IonButton
                                onClick={() => removerCardTemp(index)}
                                className="btnRemoverCard"
                              >
                                Remover
                              </IonButton>
                            </IonCol>
                          </IonRow>
                          <div className="cardPreviewSides">
                            <div>
                              <strong>Frente:</strong>
                              {card.conteudo_frente.map((item, i) => (
                                <div key={i}>
                                  {item.tipo === 'texto' && <p>{item.valor}</p>}
                                  {item.tipo === 'imagem' && item.valor && <img src={item.valor} alt="frente" className="image-preview-thumbnail" />}
                                  {item.tipo === 'arquivo' && <p>Arquivo: {item.nome}</p>}
                                </div>
                              ))}
                            </div>
                            <div>
                              <strong>Verso:</strong>
                              {card.conteudo_verso.map((item, i) => (
                                <div key={i}>
                                  {item.tipo === 'texto' && <p>{item.valor}</p>}
                                  {item.tipo === 'imagem' && item.valor && <img src={item.valor} alt="verso" className="image-preview-thumbnail" />}
                                  {item.tipo === 'arquivo' && <p>Arquivo: {item.nome}</p>}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <IonButton
                  expand="block"
                  className="btnSalvar bntSFlashcard"
                  onClick={handleSalvarOuAtualizarFlashcard}
                  disabled={
                    novoFlashcardTitulo.trim() === '' ||
                    topicoSelecionadoParaNovoFlashcard === null ||
                    cardsTemp.length === 0 ||
                    !cardsTemp.every(card => 
                      (card.conteudo_frente.some(item => item.tipo === 'texto' && item.valor.trim() !== '') || 
                       card.conteudo_frente.some(item => item.tipo === 'imagem' && item.valor.trim() !== '')) &&
                      (card.conteudo_verso.some(item => item.tipo === 'texto' && item.valor.trim() !== '') || 
                       card.conteudo_verso.some(item => item.tipo === 'imagem' && item.valor.trim() !== ''))
                    )
                  }
                >
                  {flashcardIdParaEditar ? 'Salvar Alterações' : 'Salvar Flashcard'}
                </IonButton>
              </>
            )}

            {showCardEditor && (
              <>
                <IonRow className="centroModal">
                  <h3 className="modal-title pDarkmode">{editingCardIndex !== null ? 'Editar Card' : 'Adicionar Card'}</h3>
                  <IonButton
                    onClick={() => setShowCardEditorAndInitialData(false)}
                    color="medium"
                    fill="clear"
                    className="fecharEditor"
                  >
                    Fechar Editor
                  </IonButton>
                </IonRow>

                <CardEditor
                  onSave={handleAddOrUpdateCardTemp}
                  onCancel={() => setShowCardEditorAndInitialData(false)}
                  conteudoFrenteInicial={cardEditorInitialFrente}
                  conteudoVersoInicial={cardEditorInitialVerso}
                />
              </>
            )}
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
    </>
  );
};

export default TelaInicialFlashcards;