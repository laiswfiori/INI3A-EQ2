import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonIcon, IonButton, IonModal, IonPopover, IonInput, IonRow, IonCol } from '@ionic/react';
import { library, pencil, trash, close, arrowForward } from 'ionicons/icons';
import './css/geral.css';
import './css/ui.css';
import './css/layout.css';
import Header from '../../../components/Header';
import API from '../../../lib/api';

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

  const history = useHistory();

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
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterias();
  }, []);

  const calcularProgresso = (topicos: Topico[]) => {
    const totalTopicos = topicos.length;

    const topicosConcluidos = topicos.filter(topico =>
      topico.status === 'concluído'
    ).length;

    const progresso = totalTopicos > 0 ? (topicosConcluidos / totalTopicos) * 100 : 0;

    return { totalTopicos, topicosConcluidos, progresso };
  };

  const handleInputChange = (field: string, value: string) => {
    setNovaMateria({ ...novaMateria, [field]: value });
  };

  const handleSalvar = async () => {
    const api = new API();
    const endpoint = modoModal === 'editar'
      ? `materias/${materiaSelecionada?.id}`
      : `materias`;

    const method = modoModal === 'editar' ? api.put : api.post;

    try {
      const data = await method.call(api, endpoint, { nome: novaMateria.nome });

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
    setNovaMateria({ nome: novaMateria.nome });
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
        console.log('Matéria excluída');
      } catch (err) {
        console.error('Erro ao excluir matéria:', err);
      }
    }
  };

  return (
    <IonPage className={`pagina ${showModal ? 'desfocado' : ''}`}>
      <Header />
      <IonContent className="body">
        <h1 className="titulo">Matérias</h1>
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
                <IonItem
                  key={materia.id}
                  className="materia-item"
                >
                  <IonLabel>
                    <IonRow className="containerMateria">
                      <IonIcon icon={library} className="livro" />
                      <IonCol className="td">
                        <h2 className="txtTitMat">{materia.nome}</h2>
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
                    <IonRow className="totalAtividades">
                      <p>{totalTopicos} tópicos</p>
                      <p id="txtConc">{topicosConcluidos} concluídos</p>
                    </IonRow>
                    <IonRow className="barra">
                      <div className="barraStatus" style={{ width: `${progresso}%` }}></div>
                    </IonRow>
                    <IonRow className="contIrTopicos">
                      <IonButton className="btnIrTopicos" onClick={() => history.push(`/materias/${materia.id}`)}>
                        Ir para tópicos
                        <IonIcon icon={arrowForward} className="setaMat" />
                      </IonButton>
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

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className="modalAdd">
          <IonContent className="ion-padding">
            <IonRow className="contFecharModal">
              <IonIcon icon={close} className="iconeFecharM" onClick={() => setShowModal(false)}/>
            </IonRow>
            <IonRow className="centroModal">
              <h2 className="labelT">
                {modoModal === 'adicionar' ? 'Adicionar matéria' : 'Editar matéria'}
              </h2>
            </IonRow>
            <div id="pagAdicionar">
              <IonInput
                labelPlacement="stacked"
                placeholder="Digite o nome da matéria"
                value={novaMateria.nome}
                onIonChange={(e) => handleInputChange('nome', e.detail.value!)}
                className="input"
              />
              <IonButton expand="block" onClick={handleSalvar} className="btnSalvar">
                Salvar
              </IonButton>
            </div>
          </IonContent>
        </IonModal>

        <IonPopover
          isOpen={showPopover}
          event={popoverEvent}
          onDidDismiss={() => setShowPopover(false)}
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
  );
};

export default Materias
