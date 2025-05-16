import React, { useEffect, useState, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonBadge, IonIcon, IonButton, IonModal, IonPopover, IonHeader, IonToolbar, IonTitle, IonInput, IonSelect, IonSelectOption, IonTextarea } from '@ionic/react';
import { book, pencil, trash, flash, checkmarkDone } from 'ionicons/icons';
import './css/geral.css';
import './css/ui.css';
import './css/layout.css';
import Header from '../../../components/Header';
import API from '../../../lib/api';

interface Topico {
  id: number;
  titulo: string;
  descricao: string;
  status: string;
  materia_id: number;
  created_at: string;
  updated_at: string;
}

const Conteudos: React.FC = () => {
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [topicoSelecionado, setTopicoSelecionado] = useState<Topico | null>(null);
  const configButtonRef = useRef<HTMLIonButtonElement | null>(null);
  const [popoverEvent, setPopoverEvent] = useState<MouseEvent | undefined>(undefined);

  
  const { id } = useParams<{ id: string }>();

  const history = useHistory();

  useEffect(() => {
    fetchTopicos();
  }, [id]);


  const [novoTopico, setNovoTopico] = useState({
    nome: '',
    materia: '',
    status: '',
    descricao: '',
  });

  const api = new API();

  const fetchTopicos = async () => {
    const api = new API();
    try {
      let r = await api.get("topicos");
      const topicosDaMateria = r.filter((topico: Topico) => topico.materia_id === parseInt(id));
      setTopicos(topicosDaMateria);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleInputChange = (field: string, value: string) => {
    setNovoTopico({ ...novoTopico, [field]: value });
  };

  const handleSalvar = () => {
    console.log('Salvando:', novoTopico);
    setShowModal(false);
  };

  const barraProgresso = (status: string): number => {
    switch (status.toLowerCase()) {
      case 'não iniciado':
        return 0;
      case 'em andamento':
        return 50;
      case 'concluído':
        return 100;
      default:
        return 0;
    }
  };

  const handleEditar = () => {
    if (topicoSelecionado) {
      setNovoTopico({
        nome: topicoSelecionado.titulo,
        materia: '', 
        status: topicoSelecionado.status,
        descricao: topicoSelecionado.descricao,
      });
    }
    setShowModal(true);  
    setShowPopover(false);  
  };

  const handleExcluir = async () => {
      if (topicoSelecionado) {
        let api = new API();
        try {
          await api.delete(`materias/${topicoSelecionado.id}`);
          setShowPopover(false);
          setTopicos((prev) => prev.filter(m => m.id !== topicoSelecionado.id));
          console.log('Tópico excluído');
        } catch (err) {
          console.error('Erro ao excluir tópico:', err);
        }
      }
  };

  const handleIniciar = async () => {
    if (topicoSelecionado) {
      try {
        const updatedTopico = { ...topicoSelecionado, status: 'Em andamento' };
  
        await fetch(`/api/topicos/${topicoSelecionado.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTopico),
        });
  
        setTopicoSelecionado(updatedTopico); 
        setShowPopover(false); 
        console.log('Tópico iniciado');
      } catch (err) {
        console.error('Erro ao iniciar tópico:', err);
      }
    }
  };

  const handleConcluir = async () => {
    if (topicoSelecionado) {
      try {
        const updatedTopico = { ...topicoSelecionado, status: 'Concluído' };
        setShowPopover(false);  
        console.log('Tópico concluído');
      } catch (err) {
        console.error('Erro ao concluir tópico:', err);
      }
    }
  };
  

  return (
    <IonPage className={`pagina ${showModal ? 'desfocado' : ''}`}>
      <Header />

      <IonContent className="body">
        <h1 className="titulo">Conteúdos</h1>
        <div className="linhaHorizontal"></div>

        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <IonList className="topicos-list">
            {topicos.map((topico) => (
              <IonItem
                key={topico.id}
                className="topico-item"
                button onClick={() => history.push(`/conteudos/${topico.id}`)}
              >
                <IonLabel>
                <div id="containerConfig">
                <IonButton
                   id={`config-btn-${topico.id}`}
                   className="config"
                    onClick={(e) => {
                    e.stopPropagation();
                    setTopicoSelecionado(topico);
                    setPopoverEvent(e.nativeEvent);
                    setShowPopover(true);
                  }}
                >...
                </IonButton>
                </div>
                  <div className="containerTopico">
                    <IonIcon icon={book} className="livro"/>
                    <div className="td">
                      <h2>{topico.titulo}</h2>
                      <p>{topico.descricao}</p>
                    </div>
                  </div>
                  <div className="barra">
                    <div
                      className="barraStatus"
                      style={{ width: `${barraProgresso(topico.status)}%` }}
                    ></div>
                  </div>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}

        <IonButton
          className="botao-adicionar"
          shape="round"
          color="primary"
          onClick={() => setShowModal(true)}
        > +
        </IonButton>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className="modalAdd">
          <IonContent className="ion-padding">
            <div id="pagAdicionar">
              
              <p className="label">Nome do Tópico</p>
              <IonInput
                labelPlacement="stacked"
                placeholder="Digite o nome do tópico"
                value={novoTopico.nome}
                onIonChange={(e) => handleInputChange('nome', e.detail.value!)}
                className="input"
              />

              <p className="label">Matéria</p>
              <IonSelect
                labelPlacement="stacked"
                placeholder="Selecione a matéria"
                value={novoTopico.materia}
                onIonChange={(e) => handleInputChange('materia', e.detail.value!)}
                className="input"
              >
                <IonSelectOption value="Matéria X">Matéria X</IonSelectOption>
                <IonSelectOption value="Matéria Y">Matéria Y</IonSelectOption>
              </IonSelect>

              <p className="label">Status</p>
              <IonSelect
                labelPlacement="stacked"
                placeholder="Selecione o status"
                value={novoTopico.status}
                onIonChange={(e) => handleInputChange('status', e.detail.value!)}
                className="input"
              >
                <IonSelectOption value="Em andamento">Não iniciado</IonSelectOption>
                <IonSelectOption value="Em andamento">Em andamento</IonSelectOption>
                <IonSelectOption value="Concluído">Concluído</IonSelectOption>
              </IonSelect>

              <p className="label">Descrição</p>
              <IonTextarea
                labelPlacement="stacked"
                placeholder="Escreva uma breve descrição"
                value={novoTopico.descricao}
                onIonInput={(e) => handleInputChange('descricao', e.detail.value!)}
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
         onDidDismiss={() => {
           setShowPopover(false);
           setPopoverEvent(undefined);
         }}
        >
          <IonButton expand="block" onClick={handleEditar} className="opcoes" id="btnLapis">
            <IonIcon icon={pencil} className="iconesPopover" id="lapis"/>
            Editar
          </IonButton>
          <IonButton expand="block" color="danger" onClick={handleExcluir} className="opcoes" id="btnLixo">
            <IonIcon icon={trash} className="iconesPopover" id="lixo"/>
            Excluir
          </IonButton>
          <IonButton expand="block" onClick={handleIniciar} className="opcoes" id="btnRaio">
            <IonIcon icon={flash} className="iconesPopover" id="raio"/>
            Iniciar
          </IonButton>
          <IonButton expand="block" onClick={handleConcluir} className="opcoes" id="btnCheck">
            <IonIcon icon={checkmarkDone} className="iconesPopover" id="check"/>
            Concluir
          </IonButton>
        </IonPopover>
      </IonContent>
    </IonPage>
  );
};

export default Conteudos;
