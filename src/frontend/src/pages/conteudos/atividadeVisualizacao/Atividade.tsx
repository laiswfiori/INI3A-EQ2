import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonRow, IonCol, IonIcon, IonButton } from '@ionic/react';
import { documentText, imageOutline, documentAttach, returnDownBack } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import Header from '../../../components/Header';
import API from '../../../lib/api';
import './css/ui.css';


interface Atividade {
  id: number;
  titulo: string;
  descricao: string;
  conteudo: { tipo: 'texto' | 'imagem' | 'arquivo', valor: string, nome?: string }[];
  status: string;
  tipo: string;
}

const Atividade: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [atividade, setAtividade] = useState<Atividade | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
  const fetchAtividade = async () => {
    const api = new API();
    try {
      const data = await api.get(`atividades/${id}`);
      console.log('Atividade recebida:', data);

      const conteudoCorrigido = Array.isArray(data.conteudo) 
        ? data.conteudo 
        : data.conteudo 
          ? [data.conteudo] 
          : [];

      setAtividade({
        ...data,
        conteudo: conteudoCorrigido
      });
    } catch (error) {
      console.error('Erro ao buscar atividade:', error);
      setErro('Erro ao carregar atividade');
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    fetchAtividade();
  } else {
    setErro('ID da atividade não encontrado na URL');
    setLoading(false);
  }
}, [id]);


  return (
    <IonPage className="pagina">
      <Header />
      <IonContent className="body">
        <IonRow className="contVoltar"  onClick={() => history.goBack()}>
          <IonIcon icon={returnDownBack} className="voltarAtividades"/>
          <p className="txtVoltarAtividades">Voltar para home</p>
        </IonRow>

        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : erro ? (
          <p className="error-message">{erro}</p>
        ) : atividade ? (
          <div className="atividade-visualizacao">
            <h1 className="titulo">{atividade.titulo}</h1>
            <p className="descricao">{atividade.descricao}</p>
            <p className="tipo"><strong>Tipo:</strong> {atividade.tipo}</p>

            <div className="linhaHorizontal"></div>

            <h2>Conteúdo</h2>

            {atividade.conteudo.length === 0 && (
              <p>Não há conteúdo adicionado.</p>
            )}

            {atividade.conteudo.map((item, idx) => (
              <div key={idx} className="conteudo-item">
                {item.tipo === 'texto' && (
                  <IonRow>
                    <IonCol>
                      <IonIcon icon={documentText} className="iconeConteudo"/>
                      <p>{item.valor}</p>
                    </IonCol>
                  </IonRow>
                )}
                {item.tipo === 'imagem' && (
                  <IonRow>
                    <IonCol>
                      <IonIcon icon={imageOutline} className="iconeConteudo"/>
                      <img 
                        src={item.valor} 
                        alt="Imagem da atividade" 
                        className="imagemConteudo"
                      />
                    </IonCol>
                  </IonRow>
                )}
                {item.tipo === 'arquivo' && (
                  <IonRow>
                    <IonCol>
                      <IonIcon icon={documentAttach} className="iconeConteudo"/>
                      <a 
                        href={item.valor} 
                        download={item.nome} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {item.nome}
                      </a>
                    </IonCol>
                  </IonRow>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Atividade não encontrada.</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Atividade;
