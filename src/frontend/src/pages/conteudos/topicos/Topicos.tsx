import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  IonPage, IonContent, IonList, IonItem, IonLabel, IonIcon, IonButton, IonModal, IonPopover,
  IonInput, IonTextarea, IonRow, IonCol
} from '@ionic/react';
import { layers, pencil, trash, arrowForward, image } from 'ionicons/icons';
import './css/geral.css';
import './css/ui.css';
import './css/layout.css';
import './css/darkmode.css';
import Header from '../../../components/Header';
import API from '../../../lib/api';
import { validarCamposTopico } from '../../../utils/erros';
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
  descricao: string;
  status: string;
  materia_id: number;
  created_at: string;
  updated_at: string;
  atividades: Atividade[];
}

const Topicos: React.FC = () => {
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [topicoSelecionado, setTopicoSelecionado] = useState<Topico | null>(null);
  const [popoverEvent, setPopoverEvent] = useState<MouseEvent | undefined>(undefined);
  const [modoModal, setModoModal] = useState<'adicionar' | 'editar'>('adicionar');
  const [progressoTopicos, setProgressoTopicos] = useState<{ [id: number]: number }>({});


  const [iconesTopicos, setIconesTopicos] = useState<{ [key: number]: string }>({});

  const [novoTopico, setNovoTopico] = useState({
    titulo: '',
    materia_id: 0,
    descricao: '',
  });

  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      setNovoTopico((prev) => ({ ...prev, materia_id: Number(id) }));
    }
  }, [id]);

  useEffect(() => {
    const fetchTopicos = async () => {
      setLoading(true);
      setError('');
      try {
        const api = new API();
        const topicosResponse = await api.get('topicos');
        const atividadesResponse = await api.get('atividades');

        const topicosComAtividades = topicosResponse.map((topico: Topico) => {
          const atividades = atividadesResponse.filter(
            (atividade: Atividade) => atividade.topico_id === topico.id
          );
          return { ...topico, atividades };
        });

        const topicosFiltrados = topicosComAtividades.filter(
          (topico: { materia_id: number }) => topico.materia_id === Number(id)
        );

        setTopicos(topicosFiltrados);

        const iconesSalvos = localStorage.getItem('iconesTopicos');
        if (iconesSalvos) {
          setIconesTopicos(JSON.parse(iconesSalvos));
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar tópicos');
      } finally {
        setLoading(false);
      }
    };

    fetchTopicos();
  }, [id]);

  useEffect(() => {
    const calcularProgresso = async () => {
      const progressoMap: { [id: number]: number } = {};
  
      for (const topico of topicos) {
        const progresso = await barraProgresso(topico);
        progressoMap[topico.id] = progresso;
      }
  
      setProgressoTopicos(progressoMap);
    };
  
    if (topicos.length > 0) {
      calcularProgresso();
    }
  }, [topicos]);
  

  const barraProgresso = async (topico: Topico): Promise<number> => {
    const totalAtividades = topico.atividades?.length || 0;
    const atividadesConcluidas =
      topico.atividades?.filter((atividade) => atividade.status === 'concluído').length || 0;
  
    if (
      totalAtividades > 0 &&
      atividadesConcluidas === totalAtividades &&
      topico.status !== 'concluído'
    ) {
      try {
        const api = new API();
        await api.put(`topicos/${topico.id}`, {
          titulo: topico.titulo,
          descricao: topico.descricao,
          materia_id: topico.materia_id,
          status: 'concluído'
        });
        setTopicos((prev) =>
          prev.map((t) =>
            t.id === topico.id ? { ...t, status: 'concluído' } : t
          )
        );
        
      } catch (err) {
        console.error('Erro ao atualizar status do tópico:', err);
      }
    }
  
    return totalAtividades > 0 ? (atividadesConcluidas / totalAtividades) * 100 : 0;
  };
  
  const handleInputChange = (field: keyof typeof novoTopico, value: string) => {
    setNovoTopico({ ...novoTopico, [field]: value });
  };

  const handleSalvar = async () => {
    const erro = validarCamposTopico(novoTopico);
    if (erro) {
      alert(erro);
      return;
    }

    if (!novoTopico.materia_id || novoTopico.materia_id <= 0) {
      alert('Erro: ID da matéria inválido.');
      return;
    }
    const api = new API();
    const endpoint = modoModal === 'editar'
      ? `topicos/${topicoSelecionado?.id}`
      : `topicos`;

    const method = modoModal === 'editar' ? api.put : api.post;

    try {
      const data = await method.call(api, endpoint, {
        titulo: novoTopico.titulo,
        materia_id: novoTopico.materia_id,
        descricao: novoTopico.descricao,
      });

      if (modoModal === 'editar') {
        setTopicos(prev =>
          prev.map(t => t.id === topicoSelecionado?.id
            ? { ...data, atividades: t.atividades || [] }
            : t
          )
        );
      } else {
        setTopicos(prev => [...prev, { ...data, atividades: [] }]);
      }

      setShowModal(false);
      setShowPopover(false);
    } catch (error: any) {
      console.error('Erro ao salvar tópico:', error);
      alert(error?.response?.data?.message || 'Erro desconhecido ao salvar tópico');
    }
  };

  const handleEditar = () => {
    if (topicoSelecionado) {
      setNovoTopico({ titulo: topicoSelecionado.titulo, materia_id: topicoSelecionado.materia_id, descricao: topicoSelecionado.descricao });
      setModoModal('editar');
      setShowModal(true);
      setShowPopover(false);
    }
  };

  const handleAdicionar = () => {
    setNovoTopico({ titulo: '', materia_id: novoTopico.materia_id, descricao: '' });
    setModoModal('adicionar');
    setShowModal(true);
  };

  const handleExcluir = async () => {
    if (topicoSelecionado) {
      const api = new API();
      try {
        await api.delete(`topicos/${topicoSelecionado.id}`);
        setShowPopover(false);
        setTopicos(prev => prev.filter(t => t.id !== topicoSelecionado.id));
        console.log('Tópico excluído');
      } catch (err) {
        console.error('Erro ao excluir tópico:', err);
      }
    }
  };

  const salvarIconeTopico = (topicoId: number, dataUrl: string) => {
    setIconesTopicos(prev => {
      const novos = { ...prev, [topicoId]: dataUrl };
      localStorage.setItem('iconesTopicos', JSON.stringify(novos));
      return novos;
    });
  };


  const handleIconeChange = (e: React.ChangeEvent<HTMLInputElement>, topicoId: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      salvarIconeTopico(topicoId, result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
    <ThemeManager />
    <IonPage className={`pagina ${showModal ? 'desfocado' : ''}`}>
      <Header />
      <IonContent className="bodyT">
        <h1 className="titulo titDarkMode">Tópicos</h1>
        <div className="linhaHorizontal"></div>

        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <IonList className="topicos-list">
            {topicos.map((topico) => {
              const totalAtividades = topico.atividades?.length || 0;
              const atividadesConcluidas = topico.atividades?.filter(a => a.status === 'concluído').length || 0;

              return (
                <IonItem
                  key={topico.id}
                  className="topico-item"
                >
                  <IonLabel className="topico-label">
                    <IonRow className="containerTopico" >
                      <div>
                        {iconesTopicos[topico.id] ? (
                          <img
                            src={iconesTopicos[topico.id]}
                            alt="Ícone personalizado"
                            className="imgMF imgMobile imgT"
                          />
                        ) : (
                          <IonIcon icon={layers} className="livro" />
                        )}
                      </div>

                      <IonCol className="td">
                        <h2 className="txtTitMat">{topico.titulo}</h2>
                        <p className="pDarkmode">{topico.descricao}</p>
                      </IonCol>
                      <IonCol id="containerConfig">
                        <IonButton
                          id={`config-btn-${topico.id}`}
                          className="config"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTopicoSelecionado(topico);
                            setPopoverEvent(e.nativeEvent);
                            setShowPopover(true);
                          }}
                        >
                          ...
                        </IonButton>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonIcon
                        icon={image}
                        className="iconImg"
                        onClick={(e) => {
                          e.stopPropagation();
                          const input = document.getElementById(`input-icone-${topico.id}`) as HTMLInputElement;
                          input?.click();
                        }}
                      />
                      <input
                        id={`input-icone-${topico.id}`}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleIconeChange(e, topico.id)}
                      />
                    </IonRow>

                    <IonRow className="totalAtividades">
                      <p className="pDarkmode">{totalAtividades} atividades</p>
                      <p id="txtConc">{atividadesConcluidas} concluídas</p>
                    </IonRow>
                    <IonRow className="barra">
                      <div
                        className="barraStatus"
                        style={{ width: `${progressoTopicos[topico.id] || 0}%` }}
                      />
                    </IonRow>
                    <IonRow className="contIrTopicos">
                      <IonButton className="btnIrTopicos" onClick={() => history.push(`/topicos/${topico.id}`)}>
                        Ir para atividades
                        <IonIcon icon={arrowForward} className="setaMat" />
                      </IonButton>
                    </IonRow>
                  </IonLabel>
                </IonItem>
              );
            })}
          </IonList>
        )}

        <IonButton
          className="botao-adicionar"
          shape="round"
          color="primary"
          onClick={() => handleAdicionar()}
        >
          +
        </IonButton>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className="modalAddTopico">
          <IonContent className="ion-padding">
            <IonRow className="centroModal">
              <h2 className="labelT pDarkmode">
                {modoModal === 'adicionar' ? 'Adicionar tópico' : 'Editar tópico'}
              </h2>
            </IonRow>
            <div id="pagAdicionar">
              <p className="label pDarkmode">Título</p>
              <IonInput
                placeholder="Digite o título do tópico"
                value={novoTopico.titulo}
                onIonChange={(e) => handleInputChange('titulo', e.detail.value!)}
                className="input pDarkmode"
              />
              <p className="label pDarkmode">Descrição</p>
              <IonTextarea
                placeholder="Escreva uma breve descrição"
                value={novoTopico.descricao}
                onIonInput={(e) => handleInputChange('descricao', e.detail.value!)}
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
          onDidDismiss={() => {
            setShowPopover(false);
            setPopoverEvent(undefined);
          }}
          className="popoverEE"
        >
          <IonButton expand="block" onClick={handleEditar} className="opcoes" id="btnLapis">
            <IonIcon icon={pencil} className="iconesPopover" id="lapis" />
            Editar
          </IonButton>
          <IonButton expand="block" color="danger" onClick={handleExcluir} className="opcoes" id="btnLixo">
            <IonIcon icon={trash} className="iconesPopover" id="lixo" />
            Excluir
          </IonButton>
        </IonPopover>
      </IonContent>
    </IonPage>
    </>
  );
};

export default Topicos;
