import React, { useState, useEffect, useRef } from 'react';
import { images, documentAttach } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import {
  IonPage,
  IonContent,
  IonIcon,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonPopover,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  useIonToast // Importar useIonToast
} from '@ionic/react';
import Header from '../../../components/Header';
import { alertCircle, school, close, layers, time, library, arrowForward, card } from 'ionicons/icons'; // Adicionado 'card'
import './css/geralTelaInicial.css';
import './css/uiTelaInicial.css';
import './css/layoutsTelaInicial.css';
import './css/pie.css';
import API from '../../../lib/api';

interface Topico {
  id: number;
  titulo: string;
  materia_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  flashcards: Flashcard[]; // Esta propriedade pode ser opcional se nem sempre vier na API
}

interface Materia {
  id: number;
  nome: string;
  usuario_id: number;
  topicos: Topico[]; // Esta propriedade pode ser opcional se nem sempre vier na API
}

interface Flashcard {
  id: number;
  topico_id: number;
  titulo: string;
  conteudo_frente: string; // Adicionado
  conteudo_verso: string;  // Adicionado
}

const api = new API();

const TelaInicialFlashcards: React.FC = () => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]); // Renomeado para plural e consistente
  const [materiaExpandidaId, setMateriaExpandidaId] = useState<number | null>(null);
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);
  const [popoverEvent, setPopoverEvent] = useState<any>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [novoFlashcardTitulo, setNovoFlashcardTitulo] = useState(''); // Renomeado para clareza
  const [novoFlashcardConteudoFrente, setNovoFlashcardConteudoFrente] = useState(''); // Renomeado e tipo ajustado
  const [novoFlashcardConteudoVerso, setNovoFlashcardConteudoVerso] = useState('');   // Renomeado e tipo ajustado
  const [modalMateriaSelecionada, setModalMateriaSelecionada] = useState<Materia | null>(null); // Renomeado para clareza
  const [topicoSelecionadoParaNovoFlashcard, setTopicoSelecionadoParaNovoFlashcard] = useState<number | null>(null); // Novo estado
  const history = useHistory();
  const [presentToast] = useIonToast(); // Inicializa o toast
  const [conteudoFrente, setConteudoFrente] = useState<
    { tipo: 'texto' | 'imagem' | 'arquivo'; valor: string; nome?: string }[]
  >([]);

  const [conteudoVerso, setConteudoVerso] = useState<
    { tipo: 'texto' | 'imagem' | 'arquivo'; valor: string; nome?: string }[]
  >([]);
  const inputImagemFrenteRef = useRef<HTMLInputElement>(null);
  const inputArquivoFrenteRef = useRef<HTMLInputElement>(null);
  const inputImagemVersoRef = useRef<HTMLInputElement>(null);
  const inputArquivoVersoRef = useRef<HTMLInputElement>(null);



  // Efeito para buscar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materiasData, topicosData, flashcardsData] = await Promise.all([
          api.get('materias'),
          api.get('topicos'),
          api.get('flashcards'),
        ]);
        setMaterias(materiasData);
        setTopicos(topicosData);
        setFlashcards(flashcardsData);
      } catch (error) {
        console.error('Erro ao buscar dados iniciais:', error);
        presentToast({
          message: 'Erro ao carregar dados. Tente novamente mais tarde.',
          duration: 3000,
          color: 'danger',
        });
      }
    };

    fetchData();
  }, [presentToast]); // Adicionar presentToast como dependência para evitar warning

  const toggleExpandirMateria = (materiaId: number) => {
    setMateriaExpandidaId(materiaExpandidaId === materiaId ? null : materiaId);
  };

  const handlePopoverClick = (event: React.MouseEvent) => {
    setPopoverEvent(event.nativeEvent);
    setPopoverVisible(true);
  };

  const closePopover = () => {
    setPopoverVisible(false);
  };

  const abrirModalCriarFlashcard = (materia: Materia) => {
    setNovoFlashcardTitulo('');
    setNovoFlashcardConteudoFrente('');
    setNovoFlashcardConteudoVerso('');
    setTopicoSelecionadoParaNovoFlashcard(null); // Limpar seleção de tópico
    setModalMateriaSelecionada(materia);
    setShowModal(true);
  };

  const estudarTopico = (topicoId: number) => {
    history.push(`/flashcards/estudar/${topicoId}`);
  };

  const handleSalvarFlashcard = async () => {
  if (!topicoSelecionadoParaNovoFlashcard || conteudoFrente.length === 0 || conteudoVerso.length === 0) {
    presentToast({
      message: 'Preencha conteúdo na frente e no verso do flashcard.',
      duration: 3000,
      color: 'warning',
    });
    return;
  }

  try {
    const topico = topicos.find(t => t.id === topicoSelecionadoParaNovoFlashcard);
    if (!topico) {
      presentToast({
        message: 'Tópico inválido.',
        duration: 3000,
        color: 'danger',
      });
      return;
    }

    const novoCard = {
      topico_id: topico.id,
      titulo: novoFlashcardTitulo || topico.titulo,
      conteudo_frente: conteudoFrente,
      conteudo_verso: conteudoVerso,
    };

    await api.post('flashcards', novoCard);
    presentToast({
      message: 'Flashcard criado com sucesso!',
      duration: 2000,
      color: 'success',
    });

    const updatedFlashcards = await api.get('flashcards');
    setFlashcards(updatedFlashcards);
    setShowModal(false);
    setConteudoFrente([]);
    setConteudoVerso([]);
  } catch (error) {
    presentToast({
      message: 'Erro ao salvar flashcard.',
      duration: 3000,
      color: 'danger',
    });
  }
};

  
const adicionarTexto = (lado: 'frente' | 'verso', texto: string) => {
  const novoItem = { tipo: 'texto', valor: texto };
  if (lado === 'frente') {
    setConteudoFrente([...conteudoFrente, novoItem]);
  } else {
    setConteudoVerso([...conteudoVerso, novoItem]);
  }
};

const adicionarImagem = (e: React.ChangeEvent<HTMLInputElement>, lado: 'frente' | 'verso') => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const novoItem = { tipo: 'imagem', valor: reader.result as string };
      if (lado === 'frente') {
        setConteudoFrente([...conteudoFrente, novoItem]);
      } else {
        setConteudoVerso([...conteudoVerso, novoItem]);
      }
    };
    reader.readAsDataURL(file);
  }
};

const adicionarArquivo = (e: React.ChangeEvent<HTMLInputElement>, lado: 'frente' | 'verso') => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const novoItem = { tipo: 'arquivo', valor: reader.result as string, nome: file.name };
      if (lado === 'frente') {
        setConteudoFrente([...conteudoFrente, novoItem]);
      } else {
        setConteudoVerso([...conteudoVerso, novoItem]);
      }
    };
    reader.readAsDataURL(file);
  }
};

const removerItem = (lado: 'frente' | 'verso', index: number) => {
  if (lado === 'frente') {
    setConteudoFrente(conteudoFrente.filter((_, idx) => idx !== index));
  } else {
    setConteudoVerso(conteudoVerso.filter((_, idx) => idx !== index));
  }
};


  return (
    <IonPage className="pagina">
      <Header />
      <IonContent>
        <IonGrid id="bodyTelaInicialFlashcards">
          <IonRow id="revisao">
            <IonCol id="dCapelo">
              <IonIcon icon={school} id="iconeCapelo" />
            </IonCol>
            <IonCol id="d1">
              <p className="txtGeral">Revisão do dia!</p>
              <IonButton className="revisaoGeral">
                <span className="textIniciar">Iniciar</span>
                <span className="svg">{/* SVG omitido */}</span>
              </IonButton>
            </IonCol>
            <IonCol id="d2">
              <IonButton id="btnAlerta" onClick={handlePopoverClick}>
                <IonIcon icon={alertCircle} id="iconeAlerta" />
              </IonButton>
              <IonPopover
                isOpen={popoverVisible}
                event={popoverEvent}
                trigger="btnAlerta"
                onDidDismiss={closePopover}
                className="popoverGeral"
              >
                <div id="branco">
                  <IonButton onClick={closePopover} id="btnFechar">
                    <IonIcon icon={close} className="iconeFechar" />
                  </IonButton>
                  <p>
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
          <IonRow id="estatisticas">
            <div className="estDivs">
              <IonRow className="espDiv">
                <IonCol className="altD">
                  <p className="txtGrande">{flashcards.length}</p> {/* Total de cards */}
                </IonCol>
                <IonCol className="altD iconFim">
                  <IonIcon icon={layers} className="iconesTF" />
                </IonCol>
              </IonRow>
              <IonRow>
                <p className="txtTF">Total de cards</p>
              </IonRow>
            </div>
            <div className="estDivs">
              <IonRow className="espDiv">
                <IonCol className="altD">
                  <p className="txtGrande">{materias.length}</p> {/* Matérias para estudar */}
                </IonCol>
                <IonCol className="altD iconFim">
                  <IonIcon icon={library} className="iconesTF" />
                </IonCol>
              </IonRow>
              <IonRow>
                <p className="txtTF">Matérias para estudar</p>
              </IonRow>
            </div>
            <div className="estDivs">
              <IonRow className="espDiv">
                <IonCol className="altD">
                  <p className="txtGrande">0</p> {/* Cards para revisar hoje (Lógica a ser implementada) */}
                </IonCol>
                <IonCol className="altD iconFim">
                  <IonIcon icon={time} className="iconesTF" />
                </IonCol>
              </IonRow>
              <IonRow>
                <p className="txtTF">Cards para revisar hoje</p>
              </IonRow>
            </div>
          </IonRow>
          <IonRow id="decks" className="p0">
            {materias.length > 0 ? (
              materias.map((materia) => {
                const topicosDaMateria = topicos.filter(t => t.materia_id === materia.id);
                const flashcardsDaMateria = flashcards.filter(f =>
                  topicosDaMateria.some(t => t.id === f.topico_id)
                );
                const totalCardsMateria = flashcardsDaMateria.length;
                const cardsParaRevisarMateria = 0; // Lógica para cards para revisar deve ser implementada
                const progresso = totalCardsMateria > 0 ? (cardsParaRevisarMateria / totalCardsMateria) * 100 : 0;
                const estaExpandida = materiaExpandidaId === materia.id;

                return (
                  <IonCol key={materia.id} className="materia-itemF">
                    <IonLabel>
                      <IonRow className="containerMateria">
                        <IonIcon icon={library} className="livroF" />
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
                      <IonRow className="espDC">
                        <p className="txtWC">{totalCardsMateria} cards</p>
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
                            // Você pode direcionar para uma tela de estudo geral ou por matéria
                            history.push(`/flashcards/estudar/materia/${materia.id}`);
                          }}
                        >
                          Estudar
                        </IonButton>
                        <IonButton
                          id="btnMais"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
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
                              const numFlashcards = flashcards.filter(f => f.topico_id === topico.id).length;

                              return (
                                <IonRow
                                  className="contSetaTopico clicavel"
                                  key={topico.id}
                                  onClick={() => estudarTopico(topico.id)}
                                >
                                  <IonIcon icon={arrowForward} className="setaTopico" />
                                  <p className="txtTopico">{topico.titulo}</p>
                                  <div className="contagem-flashcards">
                                    <IonIcon icon={card} />
                                    <span>{numFlashcards}</span>
                                  </div>
                                </IonRow>
                              );
                            });
                          } else {
                            return <p className="sem-topicos-aviso">Nenhum tópico com flashcards nesta matéria.</p>;
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
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className="modalFlashcards">
          <div className="modalConteudo">
            <IonRow className="contFecharModal">
              <IonIcon icon={close} className="iconeFecharM" onClick={() => setShowModal(false)} />
            </IonRow>
            <IonRow className="centroModal">
              <h2 className="label">Criar novo card</h2>
            </IonRow>
            <IonSelect
              value={topicoSelecionadoParaNovoFlashcard}
              placeholder="Escolha o tópico"
              onIonChange={(e) => setTopicoSelecionadoParaNovoFlashcard(e.detail.value)}
              className="input iFlashcard"
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
              placeholder="Conteúdo da frente"
              value={novoFlashcardConteudoFrente}
              onIonChange={(e) => setNovoFlashcardConteudoFrente(e.detail.value!)}
              className="input iFlashcard"
            />
            <IonTextarea
              placeholder="Conteúdo do verso"
              value={novoFlashcardConteudoVerso}
              onIonChange={(e) => setNovoFlashcardConteudoVerso(e.detail.value!)}
              className="input"
            />

            <IonButton expand="block" className="btnSalvar bntSFlashcard" onClick={handleSalvarFlashcard}>
              Salvar
            </IonButton>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default TelaInicialFlashcards;