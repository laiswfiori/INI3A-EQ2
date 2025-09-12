import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonIcon,
  IonButton, IonModal, IonPopover, IonInput, IonRow, IonCol
} from '@ionic/react';
import { library, pencil, trash, close, arrowForward, image, globe, brush, book, school, accessibility,
  earth, leaf, flask, planet, calculator, 
  colorPalette} from 'ionicons/icons';
import './css/geral.css';
import './css/ui.css';
import './css/layout.css';
import './css/darkmode.css';
import Header from '../../../components/Header';
import API from '../../../lib/api';
import { validarCamposMateria } from '../../../utils/erros';
import ThemeManager from '../../../utils/ThemeManager';
import '../../../utils/css/variaveisCores.css';

interface Atividade {
  id: number;
  topico_id: number;
  materia_id: number;
  titulo: string;
  descricao: string;
  conteudo: any;
  status: string;
  tipo: string;
  nivel: string;
  data_entrega?: string;
  created_at: string;
  updated_at: string;
}

interface Topico {
  id: number;
  titulo: string;
  materia_id: number;
  atividades: Atividade[];
  status: string;
  created_at: string;
  updated_at: string;
}

interface Materia {
  id: number;
  nome: string;
  topicos: Topico[];
}

  export const iconePorMateriaNome: { 
    [nome: string]: { icon: string; className: string } 
  } = {
    'PORTUGUÊS': { icon: library, className: 'm1' },
    'PORTUGUES': { icon: library, className: 'm1' },
    'LITERATURA': { icon: library, className: 'm1' },
    'GRAMÁTICA': { icon: library, className: 'm1' },
    'GRAMATICA': { icon: library, className: 'm1' },
    'INGLÊS': { icon: globe, className: 'm2' },
    'INGLES': { icon: globe, className: 'm2' },
    'ESPANHOL': { icon: globe, className: 'm2' },
    'ARTES': { icon: brush, className: 'm3' },
    'HISTÓRIA': { icon: book, className: 'm4' },
    'HISTORIA': { icon: book, className: 'm4' },
    'FILOSOFIA': { icon: school, className: 'm5' },
    'SOCIOLOGIA': { icon: accessibility, className: 'm6' },
    'GEOGRAFIA': { icon: earth, className: 'm7' },
    'BIOLOGIA': { icon: leaf, className: 'm8' },
    'QUÍMICA': { icon: flask, className: 'm9' },
    'QUIMICA': { icon: flask, className: 'm9' },
    'FÍSICA': { icon: planet, className: 'm10' },
    'FISICA': { icon: planet, className: 'm10' },
    'MATEMÁTICA': { icon: calculator, className: 'm11' },
    'MATEMATICA': { icon: calculator, className: 'm11' },
  };

const normalizarNomeMateria = (nome: string) => {
  const nomeUpper = nome.trim().toUpperCase();

  const mapa = {
    'PORTUGUÊS': 'm1',
    'PORTUGUES': 'm1',
    'LITERATURA': 'm1',
    'GRAMÁTICA': 'm1',
    'GRAMATICA': 'm1',
    'INGLÊS': 'm2',
    'INGLES': 'm2',
    'ESPANHOL': 'm2',
    'ARTES': 'm3',
    'HISTÓRIA': 'm4',
    'HISTORIA': 'm4',
    'FILOSOFIA': 'm5',
    'SOCIOLOGIA': 'm6',
    'GEOGRAFIA': 'm7',
    'BIOLOGIA': 'm8',
    'QUÍMICA': 'm9',
    'QUIMICA': 'm9',
    'FÍSICA': 'm10',
    'FISICA': 'm10',
    'MATEMÁTICA': 'm11',
    'MATEMATICA': 'm11'
  };

  const classe = mapa[nomeUpper] || '';
  return { nome: nomeUpper, classe };
};


const Materias: React.FC = () => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [materiaSelecionada, setMateriaSelecionada] = useState<Materia | null>(null);
  const [modoModal, setModoModal] = useState<'adicionar' | 'editar'>('adicionar');
  const [popoverEvent, setPopoverEvent] = useState<MouseEvent | undefined>(undefined);
  const [novaMateria, setNovaMateria] = useState({ nome: '' });
  const [iconesMaterias, setIconesMaterias] = useState<{ [key: number]: string }>({});
  const history = useHistory();

  const [coresMaterias, setCoresMaterias] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchMaterias = async () => {
      const api = new API();
      try {
        const materiasResponse = await api.get("materias");
        const topicosResponse = await api.get("topicos");
        const atividadesResponse = await api.get("atividades");

        const topicosComAtividades = topicosResponse.map((topico: Topico) => {
          const atividades = atividadesResponse.filter(
            (atividade: Atividade) => atividade.topico_id === topico.id
          );
          return { ...topico, atividades };
        });

        const materiasComTopicos = materiasResponse.map((materia: Materia) => {
          const topicos = topicosComAtividades.filter(
            (topico: Topico) => topico.materia_id === materia.id
          );
          return { ...materia, topicos };
        });
        setMaterias(materiasComTopicos);

        const iconesSalvos = localStorage.getItem('iconesMaterias');
        if (iconesSalvos) {
          setIconesMaterias(JSON.parse(iconesSalvos));
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterias();

    const coresSalvas = localStorage.getItem('coresMaterias');
    if (coresSalvas) {
      setCoresMaterias(JSON.parse(coresSalvas));
    }

  }, []);

  const salvarCorMateria = (materiaId: number, cor: string) => {
    setCoresMaterias(prev => {
      const novos = { ...prev, [materiaId]: cor };
      localStorage.setItem('coresMaterias', JSON.stringify(novos));
      return novos;
    });
  };
  

  const calcularProgresso = (topicos: Topico[]) => {
    const totalTopicos = topicos.length;
    const topicosConcluidos = topicos.filter(topico =>
      topico.status === 'concluído'
    ).length;
    const progresso = totalTopicos > 0 ? (topicosConcluidos / totalTopicos) * 100 : 0;
    console.log(totalTopicos, topicosConcluidos, progresso);
    return { totalTopicos, topicosConcluidos, progresso };
  };

  const handleInputChange = (field: string, value: string) => {
    setNovaMateria({ ...novaMateria, [field]: value });
  };

  const handleSalvar = async () => {
    const nomeValidado = novaMateria.nome?.trim() || '';

    const idMateriaEditada = modoModal === 'editar' ? materiaSelecionada?.id : null;

    // Passa a lista de matérias e o ID da matéria em edição para a validação
    const erro = validarCamposMateria({ nome: nomeValidado }, materias, idMateriaEditada);
    if (erro) {
      alert(erro);
      return;
    }
    const api = new API();
    const endpoint = modoModal === 'editar'
      ? `materias/${materiaSelecionada?.id}`
      : `materias`;
    const method = modoModal === 'editar' ? api.put : api.post;
    try {
      const nomeOriginal = novaMateria.nome.trim();
      const { classe } = normalizarNomeMateria(nomeOriginal);

      const data = await method.call(api, endpoint, { nome: nomeOriginal });

      if (classe) {
        setIconesMaterias(prev => {
          const novos = { ...prev, [data.id]: classe };
          localStorage.setItem('iconesMaterias', JSON.stringify(novos));
          return novos;
        });
      }
      if (modoModal === 'editar') {
        setMaterias(prev =>
          prev.map(m => m.id === materiaSelecionada?.id
            ? { ...data, topicos: m.topicos || [] }
            : m
          )
        );
      } else {
        setMaterias(prev => [...prev, { ...data, topicos: [] }]);
      }
      setShowModal(false);
      setShowPopover(false);
    } catch (error) {
      console.error(`Erro ao ${modoModal === 'editar' ? 'editar' : 'adicionar'} matéria:`, error);
    }
  };

  const handleEditar = () => {
    if (materiaSelecionada) {
      setNovaMateria({ nome: materiaSelecionada.nome });
      setModoModal('editar');
      setShowModal(true);
      setShowPopover(false);
    }
  };

  const handleAdicionar = () => {
    setNovaMateria({ nome: '' });
    setModoModal('adicionar');
    setShowModal(true);
  };

  const handleExcluir = async () => {
    if (materiaSelecionada) {
      const api = new API();
      try {
        await api.delete(`materias/${materiaSelecionada.id}`);
        setShowPopover(false);
        setMaterias(prev => prev.filter(m => m.id !== materiaSelecionada.id));
        setIconesMaterias(prev => {
          const novos = { ...prev };
          delete novos[materiaSelecionada.id];
          localStorage.setItem('iconesMaterias', JSON.stringify(novos));
          return novos;
        });
        console.log('Matéria excluída');
      } catch (err) {
        console.error('Erro ao excluir matéria:', err);
      }
    }
  };

  const salvarIconeMateria = (materiaId: number, dataUrl: string) => {
    setIconesMaterias(prev => {
      const novos = { ...prev, [materiaId]: dataUrl };
      localStorage.setItem('iconesMaterias', JSON.stringify(novos));
      return novos;
    });
  };

  const handleIconeChange = (e: React.ChangeEvent<HTMLInputElement>, materiaId: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      salvarIconeMateria(materiaId, result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
    <ThemeManager />
    <IonPage className={`pagina ${showModal ? 'desfocado' : ''}`}>
      <Header />
      <IonContent className="bodyM">
        <h1 className="titulo titDarkMode">Matérias</h1>
        <div className="linhaHorizontal"></div>
        {loading ? (
          <div className="loader-container"><div className="loader"></div></div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <IonList className="materias-list">
            {materias.map((materia) => {
              const { totalTopicos, topicosConcluidos, progresso } = calcularProgresso(materia.topicos);
              return (
                <IonItem key={materia.id} className="materia-item">
                  <IonLabel className="materia-label">
                    <IonRow className="containerMateria">
                      <IonCol className="col1M">
                        <div>
                          {iconesMaterias[materia.id]?.startsWith('data:image') ? (
                            <img
                              src={iconesMaterias[materia.id]}
                              alt="Ícone personalizado"
                              className="imgMF imgMobile imgM"
                            />
                          ) : (() => {
                            const key = materia.nome.trim().toUpperCase();
                            const iconeData = iconePorMateriaNome[key];
                            return (
                              <IonIcon
                                icon={iconeData ? iconeData.icon : library}
                                className={iconeData ? iconeData.className : 'livro'}
                                style={{ color: coresMaterias[materia.id] || '' }}
                              />
                            );
                          })()}
                        </div>
                        <IonRow>
                          <IonIcon
                            icon={image}
                            className="iconImg"
                            onClick={(e) => {
                              e.stopPropagation();
                              const input = document.getElementById(`input-icone-${materia.id}`) as HTMLInputElement;
                              input?.click();
                            }}
                          />
                          <input
                            id={`input-icone-${materia.id}`}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => handleIconeChange(e, materia.id)}
                          />
                          <IonIcon
                            icon={colorPalette}
                            className="iconImg"
                            id="iconPaleta"
                            onClick={(e) => {
                              e.stopPropagation();
                              const input = document.getElementById(`color-picker-${materia.id}`) as HTMLInputElement;
                              input?.click();
                            }}
                          />
                          <input
                            id={`color-picker-${materia.id}`}
                            className="seletorCor"
                            type="color"
                            style={{ width: '0px', height: '0px', border: 'none', background: 'none', cursor: 'pointer' }}
                            value={coresMaterias[materia.id] || '#ffffff'}
                            onChange={(e) => salvarCorMateria(materia.id, e.target.value)}
                          />

                        </IonRow>
                      </IonCol>
                      <IonCol className="col2M">
                        <IonRow>
                          <IonCol className="td tdMat">
                            <h2 className="txtTMat">{materia.nome}</h2>
                          </IonCol>
                          <IonCol id="containerConfig">
                            <IonButton
                              id={`config-btn-${materia.id}`}
                              className="config"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMateriaSelecionada(materia);
                                setPopoverEvent(e.nativeEvent);
                                setShowPopover(true);
                              }}
                            >
                              ...
                            </IonButton>
                          </IonCol>
                        </IonRow>
                      </IonCol>
                      <IonRow className="rowBarra">
                        <IonRow className="totalAtividades">
                          <p className="pDarkmode">{totalTopicos} tópicos</p>
                          <p id="txtConc">{topicosConcluidos} concluídos</p>
                        </IonRow>
                        <IonRow className="barra">
                          <div className="barraStatus" style={{ width: `${progresso}%` }}></div>
                        </IonRow>
                      </IonRow>
                      <IonRow className="contIrTopicos">
                          <IonButton className="btnIrTopicos" onClick={() => history.replace(`/materias/${materia.id}`)}>
                            Ir para tópicos
                            <IonIcon icon={arrowForward} className="setaMat" />
                          </IonButton>
                        </IonRow>
                    </IonRow>
                  </IonLabel>
                </IonItem>
              );
            })}
          </IonList>
        )}
        <IonButton className="botao-adicionar" shape="round" color="primary" onClick={handleAdicionar}>
          +
        </IonButton>
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className="modalAddMateria">
          <IonContent className="ion-padding">
            <IonRow className="contFecharModal">
              <IonIcon icon={close} className="iconeFecharM" onClick={() => setShowModal(false)} />
            </IonRow>
            <IonRow className="centroModal">
              <h2 className="labelT pDarkmode">
                {modoModal === 'adicionar' ? 'Adicionar matéria' : 'Editar matéria'}
              </h2>
            </IonRow>
            <div id="pagAdicionar">
            <p className="label pDarkmode">Nome</p>
              <IonInput
                labelPlacement="stacked"
                placeholder="Digite o nome da matéria"
                value={novaMateria.nome}
                onIonInput={(e) => handleInputChange('nome', e.detail.value!)}
                className="input pDarkmode"
              />
              <IonButton expand="block" onClick={handleSalvar} className="btnSalvar btnSalvarDarkmode">
                Salvar
              </IonButton>
            </div>
          </IonContent>
        </IonModal>
        <IonPopover
          isOpen={showPopover}
          event={popoverEvent}
          onDidDismiss={() => setShowPopover(false)}
          className="popoverEE"
        >
          <IonButton expand="block" onClick={handleEditar} className="opcoes" id="btnLapis">
            <IonIcon icon={pencil} className="iconesPopover" id="lapis" />
            Editar
          </IonButton>
          <IonButton expand="block" onClick={handleExcluir} className="opcoes" id="btnLixo">
            <IonIcon icon={trash} className="iconesPopover" id="lixo" />
            Excluir
          </IonButton>
        </IonPopover>
      </IonContent>
    </IonPage>
    </>
  );
};

export default Materias;
