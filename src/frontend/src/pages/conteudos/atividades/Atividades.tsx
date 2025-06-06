import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonIcon, IonButton, 
  IonModal, IonPopover, IonInput, IonTextarea, IonRow, IonCol, IonBadge } from '@ionic/react';
import { pencil, trash, flash, checkmarkDone, close, checkmark, arrowForward, documentText, images, documentAttach  } from 'ionicons/icons';
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

const Atividades: React.FC = () => {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState<Atividade | null>(null);
  const [modoModal, setModoModal] = useState<'adicionar' | 'editar'>('adicionar');
  const [popoverEvent, setPopoverEvent] = useState<MouseEvent | undefined>(undefined);
  
  const alterarStatus = async (atividade: Atividade, novoStatus: string) => {
    const api = new API();
  
    try {
      const atualizada = { ...atividade, status: novoStatus };
      const data = await api.put(`atividades/${atividade.id}`, atualizada);
  
      setAtividades(prev => 
        prev.map(a => a.id === atividade.id ? data : a)
      );
    } catch (err: any) {
      console.error('Erro ao atualizar status:', err);
      alert('Erro ao atualizar o status da atividade.');
    }
  };
  

  const [novaAtividade, setNovaAtividade] = useState({
    titulo: '',
    descricao: '',
    topico_id: 0,
    status: 'não iniciado',
    tipo: 'teórica',
  });

  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      setNovaAtividade(prev => ({ ...prev, topico_id: Number(id) }));
    }
  }, [id]);

  useEffect(() => {
    const fetchAtividades = async () => {
      setLoading(true);
      setError('');
      
      try {
        const api = new API();
        const atividadesResponse = await api.get("atividades");
        
        const atividadesFiltradas = id 
          ? atividadesResponse.filter((a: Atividade) => a.topico_id === Number(id))
          : atividadesResponse;
        
        setAtividades(atividadesFiltradas);
        console.log("Atividades carregadas:", atividadesFiltradas);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar atividades');
        console.error("Erro ao buscar atividades:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAtividades();
  }, [id]);

  const handleInputChange = (field: keyof typeof novaAtividade, value: string) => {
    setNovaAtividade({ ...novaAtividade, [field]: value });
  };

  const handleSalvar = async () => {
    if (!novaAtividade.titulo.trim()) {
      alert('O título da atividade é obrigatório');
      return;
    }

    const api = new API();
    const endpoint = modoModal === 'editar'
      ? `atividades/${atividadeSelecionada?.id}`
      : `atividades`;

    const method = modoModal === 'editar' ? api.put : api.post;

    try {
      const data = await method.call(api, endpoint, novaAtividade);

      if (modoModal === 'editar') {
        setAtividades(prev =>
          prev.map(a => a.id === atividadeSelecionada?.id ? data : a)
        );
      } else {
        setAtividades(prev => [...prev, data]);
      }

      setShowModal(false);
      setShowPopover(false);
      setNovaAtividade({
        titulo: '',
        descricao: '',
        topico_id: novaAtividade.topico_id,
        status: 'não iniciado',
        tipo: '',
      });
    } catch (error: any) {
      console.error(`Erro ao ${modoModal === 'editar' ? 'editar' : 'adicionar'} atividade:`, error);
      alert(error?.response?.data?.message || 'Erro ao salvar atividade');
    }
  };
  const handleEditar = () => {
    if (atividadeSelecionada) {
      setNovaAtividade({
        titulo: atividadeSelecionada.titulo,
        descricao: atividadeSelecionada.descricao,
        topico_id: atividadeSelecionada.topico_id,
        status: atividadeSelecionada.status,
        tipo: atividadeSelecionada.tipo,
      });
      setModoModal('editar');
      setShowModal(true);
      setShowPopover(false);
    }
  };

  const handleAdicionar = () => {
    setNovaAtividade({
      titulo: '',
      descricao: '',
      topico_id: novaAtividade.topico_id,
      status: 'não iniciado',
      tipo: '',
    });
    setModoModal('adicionar');
    setShowModal(true);
  };

  const handleExcluir = async () => {
    if (atividadeSelecionada) {
      const confirmacao = window.confirm('Tem certeza que deseja excluir esta atividade?');
      if (!confirmacao) return;

      const api = new API();
      try {
        await api.delete(`atividades/${atividadeSelecionada.id}`);
        setAtividades(prev => prev.filter(a => a.id !== atividadeSelecionada.id));
        setShowPopover(false);
      } catch (err: any) {
        console.error('Erro ao excluir atividade:', err);
        alert(err?.response?.data?.message || 'Erro ao excluir atividade');
      }
    }
  };

  /* const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR'); 
  }; */


  return (
    <IonPage className={`pagina ${showModal ? 'desfocado' : ''}`}>
      <Header />
      <IonContent className="body">
        <h1 className="titulo">Atividades</h1>
        <div className="linhaHorizontal"></div>

        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <IonList className="atividades-list">
            {atividades.map((atividade) => (
              <IonItem key={atividade.id} className={`atividade-item ${atividade.status === 'concluído' ? 'concluida' : ''}`}>
                  <IonRow className="containerAtividade">
                    <IonIcon icon={documentText} className="livro" />
                    <IonCol className="td">
                      <h2 className="txtTitMat">
                        {atividade.titulo}
                      </h2>
                      <p className="sRisco">{atividade.descricao}</p>
                        <p className="sRisco">Tipo: {atividade.tipo}</p>
                    </IonCol>
                    <IonCol id="containerConfig">
                      <IonButton
                        id={`config-btn-${atividade.id}`}
                        className="config"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAtividadeSelecionada(atividade);
                          setPopoverEvent(e.nativeEvent);
                          setShowPopover(true);
                        }}
                      >
                        ...
                      </IonButton>
                    </IonCol>
                    <IonRow className="contIrTopicos">
                      {atividade.status === 'não iniciado' && (
                        <IonButton
                          expand="block"
                          className="btnIC"
                          id="btnRaio"
                          onClick={async () => {
                            await alterarStatus(atividade, 'em andamento');
                            history.push(`/atividades/${atividade.id}`);
                          }}
                        >
                          <IonIcon icon={flash} className="iconesPopover" id="raio"/>
                          Iniciar
                        </IonButton>
                      )}

                      {(atividade.status === 'em andamento') && (
                        <IonButton
                          expand="block"
                          className="btnIC"
                          id="btnCheck"
                          onClick={() => alterarStatus(atividade, 'concluído')}
                        >
                          <IonIcon icon={checkmarkDone} className="iconesPopover" id="check"/>
                          Concluir
                        </IonButton>
                      )}
                    </IonRow>
                  </IonRow>
              </IonItem>
            ))}
          </IonList>
        )}

        <IonButton 
          className="botao-adicionar" 
          shape="round" 
          color="primary" 
          onClick={handleAdicionar}
        >
          +
        </IonButton>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className="modalAddAtividade">
          <IonContent className="ion-padding">
            <IonRow className="contFecharModal">
              <IonIcon 
                icon={close} 
                className="iconeFecharM" 
                onClick={() => setShowModal(false)} 
              />
            </IonRow>
            <IonRow className="centroModal">
              <h2 className="labelT">
                {modoModal === 'adicionar' ? 'Adicionar atividade' : 'Editar atividade'}
              </h2>
            </IonRow>
            <div id="pagAdicionar">
              <p className="label">Título</p>
              <IonInput
                placeholder="Digite o título da atividade"
                value={novaAtividade.titulo}
                onIonChange={(e) => handleInputChange('titulo', e.detail.value!)}
                className="input"
              />
              
              <p className="label">Descrição</p>
              <IonTextarea
                placeholder="Escreva uma breve descrição"
                value={novaAtividade.descricao}
                onIonChange={(e) => handleInputChange('descricao', e.detail.value!)}
                className="input"
                rows={4}
              />
              
              <p className="label">Tipo</p>
              <IonInput
                value={novaAtividade.tipo}
                className="input"
                readonly
              />
              
              <p className="label">Conteúdo</p>
              <IonTextarea
                value={novaAtividade.tipo}
                placeholder="Insira o conteúdo"
                className="input"
                readonly
              />

              <IonRow className="flexInicio">
                <IonIcon icon={images} className="iconesAdd"/>
                <IonIcon icon={documentAttach} className="iconesAdd"/>
              </IonRow>

              <IonButton 
                expand="block" 
                onClick={handleSalvar} 
                className="btnSalvar"
              >
                <IonIcon icon={checkmark} slot="start" />
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
        >
          <IonButton expand="block" onClick={handleEditar} className="opcoes" id="btnLapis" >
            <IonIcon icon={pencil} className="iconesPopover" id="lapis" />
            Editar
          </IonButton>
          <IonButton expand="block" onClick={handleExcluir} className="opcoes" id="btnLixo" >
            <IonIcon icon={trash} className="iconesPopover" id="lixo" />
            Excluir
          </IonButton>
        </IonPopover>
      </IonContent>
    </IonPage>
  );
};

export default Atividades;