import React, { useEffect, useState, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  IonPage, IonContent, IonList, IonItem, IonLabel, IonIcon, IonButton, 
  IonModal, IonPopover, IonInput, IonTextarea, IonRow, IonCol, IonSelect, IonSelectOption
} from '@ionic/react';
import { pencil, trash, flash, checkmarkDone, close, checkmark, arrowForward, documentText, reader, map, clipboard, newspaper, images } from 'ionicons/icons';
import './css/geral.css';
import './css/ui.css';
import './css/layout.css';
import Header from '../../../components/Header';
import API from '../../../lib/api';
import AvaliarModal from './AvaliarModal'; 
import { validarCamposAtividade } from '../../../utils/erros';
import { useSoundPlayer } from '../../../utils/Som';

interface Atividade {
  id: number;
  topico_id: number;
  materia_id: number;
  titulo: string;
  descricao: string;
  conteudo: string | { tipo: 'texto' | 'imagem' | 'arquivo', valor: string, nome?: string }[];
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
  const [textoTemp, setTextoTemp] = useState('');

  const [imagensPreview, setImagensPreview] = useState<{ [atividadeId: number]: string }>({});

  const inputImagemRef = useRef<HTMLInputElement>(null);

  const [showModalAvaliar, setShowModalAvaliar] = useState(false);
  const [atividadeAvaliar, setAtividadeAvaliar] = useState<Atividade | null>(null);

  const { playSomIniciar, playSomConcluir } = useSoundPlayer();

  const adicionarImagemAtividadeSelecionada = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !atividadeSelecionada) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imagemBase64 = reader.result as string;

      try {
        const api = new API();
        const conteudoAtualizado = [{ tipo: 'imagem', valor: imagemBase64 }];

        const dataAtualizada = await api.put(`atividades/${atividadeSelecionada.id}`, {
          ...atividadeSelecionada,
          conteudo: conteudoAtualizado,
        });
        setAtividades(prev =>
          prev.map(a => (a.id === atividadeSelecionada.id ? dataAtualizada : a))
        );

        setAtividadeSelecionada(dataAtualizada);

        setImagensPreview(prev => ({
          ...prev,
          [atividadeSelecionada.id]: imagemBase64,
        }));
      } catch (error) {
        alert('Erro ao atualizar a imagem da atividade');
        console.error(error);
      }
    };

    reader.readAsDataURL(file);
  };

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
    conteudo: [] as { tipo: 'texto' | 'imagem' | 'arquivo', valor: string, nome?: string }[],
  });

  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    localStorage.setItem('imagensPreview', JSON.stringify(imagensPreview));
  }, [imagensPreview]);

  useEffect(() => {
    if (id) {
      setNovaAtividade(prev => ({ ...prev, topico_id: Number(id) }));
    }
  }, [id]);

  useEffect(() => {
    const imagensSalvas = localStorage.getItem('imagensPreview');
    let imagens: { [atividadeId: number]: string } = {};

    if (imagensSalvas) {
      try {
        imagens = JSON.parse(imagensSalvas);
      } catch {
        imagens = {};
      }
    }

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

        setImagensPreview(imagens);

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
    const erro = validarCamposAtividade(novaAtividade);
    if (erro) {
      alert(erro);
      return;
    }

    const conteudoFinal = textoTemp.trim()
      ? [...novaAtividade.conteudo, { tipo: 'texto', valor: textoTemp.trim() }]
      : novaAtividade.conteudo;

    try {
      const api = new API();
      const endpoint = modoModal === 'editar'
        ? `atividades/${atividadeSelecionada?.id}`
        : `atividades`;

      const method = modoModal === 'editar' ? api.put : api.post;

      const data = await method.call(api, endpoint, {
        ...novaAtividade,
        conteudo: conteudoFinal,
      });

      if (modoModal === 'editar') {
        setAtividades(prev =>
          prev.map(a => a.id === atividadeSelecionada?.id ? data : a)
        );
      } else {
        setAtividades(prev => [...prev, data]);
      }

      setTextoTemp('');
      setNovaAtividade({
        titulo: '',
        descricao: '',
        topico_id: novaAtividade.topico_id,
        status: 'não iniciado',
        tipo: '',
        conteudo: [],
      });

      setShowModal(false);
      setShowPopover(false);
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
        conteudo: atividadeSelecionada.conteudo as { tipo: 'texto' | 'imagem' | 'arquivo', valor: string, nome?: string }[],
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
      conteudo: [],
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

        setImagensPreview(prev => {
          const copia = { ...prev };
          delete copia[atividadeSelecionada.id];
          return copia;
        });
      } catch (err: any) {
        console.error('Erro ao excluir atividade:', err);
        alert(err?.response?.data?.message || 'Erro ao excluir atividade');
      }
    }
  };

  const abrirModalAvaliar = (atividade: Atividade) => {
    setAtividadeAvaliar(atividade);
    setShowModalAvaliar(true);
  };

  const salvarAvaliacao = async (dados: any) => {
    if (!atividadeAvaliar) return;

    const api = new API();

    try {
      const atualizada = await api.put(`atividades/${atividadeAvaliar.id}`, {
        ...atividadeAvaliar,
        status: 'concluído',
        ...dados,
      });

      setAtividades(prev =>
        prev.map(a => (a.id === atividadeAvaliar.id ? atualizada : a))
      );

      setShowModalAvaliar(false);
    } catch (error) {
      alert('Erro ao salvar avaliação');
    }
  };

  const getIconPorTipo = (tipo: string) => {
    const tipoLower = tipo.toLowerCase();
    if (tipoLower.includes('resumo') || tipoLower.includes('anota')) return documentText;
    if (tipoLower.includes('lista')) return reader;
    if (tipoLower.includes('mapa')) return map;
    if (tipoLower.includes('prova') || tipoLower.includes('simulado')) return clipboard;
    if (tipoLower.includes('tarefa')) return newspaper;
    return documentText; 
  };

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
            {atividades
              .slice()
              .sort((a, b) => {
                if (a.status === 'concluído' && b.status !== 'concluído') return 1;
                if (a.status !== 'concluído' && b.status === 'concluído') return -1;
                return 0;
              })
              .map((atividade) => (
                <IonItem key={atividade.id} className={`atividade-item ${atividade.status === 'concluído' ? 'concluida' : ''}`}>
                  <IonRow className="containerAtividade" style={{ position: 'relative' }}>
                    <IonRow className="largura">
                      {imagensPreview[atividade.id] ? (
                        <img
                          src={imagensPreview[atividade.id]}
                          alt="Imagem da atividade"
                          className="imgMF imgMobile"
                        />
                      ) : (
                        <IonIcon icon={getIconPorTipo(atividade.tipo)} className="livro" />
                      )}

                      <IonCol className="td">
                        <h2 className="txtTitMat">{atividade.titulo}</h2>
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
                    </IonRow>

                    <IonRow>
                      <IonIcon
                        icon={images}
                        className="iconImg"
                        onClick={() => {
                          setAtividadeSelecionada(atividade);
                          inputImagemRef.current?.click();
                        }}
                        title="Alterar imagem"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={adicionarImagemAtividadeSelecionada}
                        ref={inputImagemRef}
                        style={{ display: 'none' }}
                      />
                    </IonRow>

                    <IonRow className="contIrTopicos">
                      {atividade.status === 'não iniciado' && (
                        <IonButton
                          expand="block"
                          className="btnIC"
                          id="btnRaio"
                          onClick={async () => {
                            playSomIniciar(); 
                            await alterarStatus(atividade, 'em andamento');
                            history.push(`/atividades/${atividade.id}`);
                          }}
                        >
                          <IonIcon icon={flash} className="iconesPopover" id="raio"/>
                          Iniciar
                        </IonButton>
                      )}

                      {atividade.status === 'em andamento' && (
                        <>
                          <IonButton
                            expand="block"
                            className="btnIC"
                            id="btnCheck"
                            onClick={() => {
                              playSomConcluir(); 
                              abrirModalAvaliar(atividade);  
                            }}
                          >
                            <IonIcon icon={checkmarkDone} className="iconesPopover" id="check" />
                            Concluir
                          </IonButton>

                          <IonButton
                            expand="block"
                            className="btnIC"
                            id="btnVer"
                            onClick={() => history.push(`/atividades/${atividade.id}`)}
                          >
                            <IonIcon icon={arrowForward} className="iconesPopover" id="ver"/>
                            Ver
                          </IonButton>
                        </>
                      )}

                      {atividade.status === 'concluído' && (
                        <IonButton
                          expand="block"
                          className="btnIC"
                          id="btnVer"
                          onClick={() => history.push(`/atividades/${atividade.id}`)}
                        >
                          <IonIcon icon={arrowForward} className="iconesPopover" id="ver"/>
                          Ver
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
              <IonSelect
                value={novaAtividade.tipo}
                className="input"
                onIonChange={(e) => handleInputChange('tipo', e.detail.value!)}
              >
                <IonSelectOption value="resumo">Resumo</IonSelectOption>
                <IonSelectOption value="lista">Lista</IonSelectOption>
                <IonSelectOption value="mapa mental">Mapa Mental</IonSelectOption>
                <IonSelectOption value="prova">Prova</IonSelectOption>
                <IonSelectOption value="anotações">Anotações</IonSelectOption>
                <IonSelectOption value="tarefa">Tarefa</IonSelectOption>
                <IonSelectOption value="simulado">Simulado</IonSelectOption>
              </IonSelect>
              
              <p className="label">Conteúdo</p>

              <IonTextarea
                placeholder="Digite texto e clique fora para adicionar"
                className="input"
                rows={4}
                value={textoTemp}
                onIonChange={(e) => setTextoTemp(e.detail.value!)}
                onIonBlur={() => {
                  const texto = textoTemp.trim();
                  if (texto) {
                    setNovaAtividade(prev => ({
                      ...prev,
                      conteudo: [...prev.conteudo, { tipo: 'texto', valor: texto }]
                    }));
                    setTextoTemp('');
                  }
                }}
              />

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

        <AvaliarModal
          isOpen={showModalAvaliar}
          onDidDismiss={() => setShowModalAvaliar(false)}
          atividade={atividadeAvaliar}
          onSalvar={salvarAvaliacao}
        />
      </IonContent>
    </IonPage>
  );
};

export default Atividades;
