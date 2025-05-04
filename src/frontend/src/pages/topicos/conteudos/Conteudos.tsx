import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonBadge, IonIcon, IonButton, IonModal, IonHeader, IonToolbar, IonTitle, IonInput, IonSelect, IonSelectOption, IonTextarea } from '@ionic/react';
import { add } from 'ionicons/icons';
import './css/geral.css';
import './css/ui.css';
import Header from '../../../components/Header';
import API from '../../../lib/api';

interface Topico {
  id: number;
  titulo: string;
  descricao: string;
  status: string;
  usuario_id: number;
  created_at: string;
  updated_at: string;
}

const Conteudos: React.FC = () => {
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [novoTopico, setNovoTopico] = useState({
    nome: '',
    materia: '',
    status: '',
    descricao: '',
  });

  useEffect(() => {
    let api = new API();
    const fetchTopicos = async () => {
      try {
        let r = await api.get("topicos");
        setTopicos(r);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopicos();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setNovoTopico({ ...novoTopico, [field]: value });
  };

  const handleSalvar = () => {
    console.log('Salvando:', novoTopico);
    setShowModal(false);
  };

  return (
    <IonPage className={`pagina ${showModal ? 'desfocado' : ''}`}>
      <Header />

      <IonContent className="body">
        <h1 className="titulo">Conteúdos</h1>
        <div className="linhaHorizontal"></div>

        {loading ? (
          <p>Carregando tópicos...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <IonList className="topicos-list">
            {topicos.map((topico) => (
              <IonItem
                key={topico.id}
                className="topico-item"
                routerLink={`/conteudos/${topico.id}`}
                detail
              >
                <IonLabel>
                  <h2>{topico.titulo}</h2>
                  <p>{topico.descricao}</p>
                </IonLabel>
                <IonBadge slot="end" color="primary">
                  {Math.floor(Math.random() * 10) + 1} atividades
                </IonBadge>
              </IonItem>
            ))}
          </IonList>
        )}

        <IonButton
          className="botao-adicionar"
          expand="fixed"
          shape="round"
          color="primary"
          onClick={() => setShowModal(true)}
        >
          <IonIcon icon={add} className="icone" style={{ fontSize: '20rem', width: '20rem', height: '20rem' }} />
        </IonButton>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className="modalAdd">
          <IonContent className="ion-padding">
            <div id="pagAdicionar">
              <IonInput
                label="Nome do Tópico"
                labelPlacement="stacked"
                placeholder="Digite o nome do tópico"
                value={novoTopico.nome}
                onIonChange={(e) => handleInputChange('nome', e.detail.value!)}
                className="input"
              />

              <IonSelect
                label="Matéria"
                labelPlacement="stacked"
                placeholder="Selecione a matéria"
                value={novoTopico.materia}
                onIonChange={(e) => handleInputChange('materia', e.detail.value!)}
                className="input"
              >
                <IonSelectOption value="Matéria X">Matéria X</IonSelectOption>
                <IonSelectOption value="Matéria Y">Matéria Y</IonSelectOption>
              </IonSelect>

              <IonSelect
                label="Status"
                labelPlacement="stacked"
                placeholder="Selecione o status"
                value={novoTopico.status}
                onIonChange={(e) => handleInputChange('status', e.detail.value!)}
                className="input"
              >
                <IonSelectOption value="Em andamento">Em andamento</IonSelectOption>
                <IonSelectOption value="Concluído">Concluído</IonSelectOption>
              </IonSelect>

              <IonTextarea
                label="Descrição"
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
      </IonContent>
    </IonPage>
  );
};

export default Conteudos;
