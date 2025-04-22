import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonBadge } from '@ionic/react';
import './css/geral.css';
import Header from '../../../components/Header';

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

  useEffect(() => {
    const fetchTopicos = async () => {
      try {
        const response = await fetch("http://localhost:8000/topicos");
        if (!response.ok) {
          throw new Error('Erro ao carregar tópicos');
        }
        const data = await response.json();
        setTopicos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopicos();
  }, []);

  return (
    <IonPage className="pagina">
      <Header />
      
      <IonContent className="body">
        <div className="container">
          <h1 className="titulo">Conteúdos</h1>
          
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
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Conteudos;