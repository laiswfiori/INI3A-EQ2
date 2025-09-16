import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonRow, IonCol, IonIcon, IonButton } from '@ionic/react';
import { documentText, imageOutline, documentAttach, returnDownBack } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import Header from '../../../components/Header';
import API from '../../../lib/api';
import './css/ui.css';
import './css/layouts.css';
import './css/darkmode.css';
import ThemeManager from '../../../utils/ThemeManager';
import '../../../utils/css/variaveisCores.css';

interface Atividade {
  id: number;
  topico_id: number; // <-- Adicione este campo!
  titulo: string;
  descricao: string;
  conteudo: { tipo: 'texto' | 'imagem' | 'arquivo', valor: string, nome?: string }[];
  status: string;
  tipo: string;
  data_entrega?: string;
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

  const renderTexto = () => (
    <div className="metadeColuna">
      <div className="tituloSecao pDarkmode">Texto</div>
      {atividade!.conteudo
        .filter(item => item.tipo === 'texto')
        .map((item, i) => (
          <div
            key={i}
            className="pDarkmode"
            dangerouslySetInnerHTML={{ __html: item.valor }}
          />
        ))
      }
    </div>
  );


  const renderImagem = () => (
    <div>
      <div className="tituloSecao pDarkmode">Imagens</div>
      <div className="flexDocumentosImgs flexImgsWide">
        {atividade!.conteudo
          .filter(item => item.tipo === 'imagem')
          .map((item, i) => (
            <img key={i} src={item.valor} alt="Imagem da atividade" className="imagemConteudo" />
          ))}
      </div>
    </div>
  );


  const renderPdf = () => (
    <div>
      <div className="tituloSecao pDarkmode">Documentos</div>
      <div className="flexDocumentosImgs">
        {atividade!.conteudo
          .filter(item => item.tipo === 'arquivo')
          .map((item, i) => (
            <a key={i} href={item.valor} download={item.nome} target="_blank" rel="noopener noreferrer">
              {item.nome}
            </a>
          ))}
      </div>
    </div>
  );

  return (
    <>
    <ThemeManager />
    <IonPage className="pagina">
      <Header />
      <IonContent className="bodyAV">
        <IonRow
          className="contVoltar"
          onClick={() => history.replace(`/topicos/${atividade?.topico_id}`)}
          style={{ cursor: 'pointer', alignItems: 'center' }}
        >
          <IonIcon icon={returnDownBack} className="voltarT pDarkmode"/>
          <p className="txtVoltarT pDarkmode">Voltar para atividades</p>
        </IonRow>

        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : erro ? (
          <p className="error-message">{erro}</p>
        ) : atividade ? (
          <div className="atividade-visualizacao">
            <h1 className="titulo pDarkmode">{atividade.titulo}</h1>
            <p className="descricao pDarkmode">{atividade.descricao}</p>
            <p className="tipo pDarkmode"><strong>Tipo:</strong> {atividade.tipo}</p>

            <div className="linhaHorizontal"></div>

            <h2 className="txtCentro pDarkmode">Atividade</h2>

            {atividade.conteudo.length === 0 && (
              <p>Não há conteúdo adicionado.</p>
            )}

            {(() => {
              const temTexto = atividade.conteudo.some(item => item.tipo === 'texto');
              const temImagem = atividade.conteudo.some(item => item.tipo === 'imagem');
              const temPdf = atividade.conteudo.some(item => item.tipo === 'arquivo');

              return (
                <IonRow className="gridAtividade">
                  {temTexto && (
                    <IonCol
                      size={temImagem && temPdf ? '7' : '8'}
                      className="colPrincipal"
                    >
                      {renderTexto()}
                    </IonCol>
                  )}

                  {(temImagem || temPdf) && (
                    <IonCol
                      size={temTexto ? (temImagem && temPdf ? '5' : '4') : '6'}
                      className="colSecundaria"
                    >
                      {temImagem && (
                        <div className="metadeColuna bordaInferior">
                          {renderImagem()}
                        </div>
                      )}
                      {temPdf && (
                        <div className="metadeColuna">
                          {renderPdf()}
                        </div>
                      )}
                    </IonCol>
                  )}
                </IonRow>
              );
            })()}
          </div>
        ) : (
          <p>Atividade não encontrada.</p>
        )}
      </IonContent>
    </IonPage>
    </>
  );
};

export default Atividade;
