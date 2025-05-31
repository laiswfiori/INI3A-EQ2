import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonIcon, IonButton, IonGrid, IonRow, IonCol, IonLabel, IonPopover } from '@ionic/react';
import Header from '../../../components/Header';
import { alertCircle, school, close, layers, time, library, arrowForward } from 'ionicons/icons';
import './css/geralTelaInicial.css';
import './css/uiTelaInicial.css';
import './css/layoutsTelaInicial.css';
import './css/pie.css';
import API from '../../../lib/api';

interface Topico {
  id: number;
  titulo: string;
  materia_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Materia {
  id: number;
  nome: string;
  usuario_id: number;
  topicos: Topico[];
}

const api = new API();

const TelaInicialFlashcards: React.FC = () => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [materiaExpandidaId, setMateriaExpandidaId] = useState<number | null>(null);
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);
  const [popoverEvent, setPopoverEvent] = useState<any>(undefined);

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const materiasData: Materia[] = await api.get('materias');
        setMaterias(materiasData);
      } catch (error) {
        console.error('Erro ao buscar matérias:', error);
      }
    };

    const fetchTopicos = async () => {
      try {
        const topicosData: Topico[] = await api.get('topicos');
        setTopicos(topicosData);
      } catch (error) {
        console.error('Erro ao buscar tópicos:', error);
      }
    };

    fetchMaterias();
    fetchTopicos();
  }, []);

  const toggleExpandirMateria = (materiaId: number) => {
    if (materiaExpandidaId === materiaId) {
      setMateriaExpandidaId(null);
    } else {
      setMateriaExpandidaId(materiaId);
    }
  };

  const handlePopoverClick = (event: React.MouseEvent) => {
    setPopoverEvent(event.nativeEvent);
    setPopoverVisible(true);
  };

  const closePopover = () => {
    setPopoverVisible(false);
  };

  return (
    <IonPage className="pagina">
      <Header />
      <IonContent>
        <IonGrid id="bodyTelaInicialFlashcards">
          <IonRow id="revisao">
            <IonCol id="dCapelo">
              <IonIcon icon={school} id="iconeCapelo" />
            </IonCol>
            <IonCol id="d1">
              <p className="txtGeral">Revisão do dia!</p>
              <IonButton className="revisaoGeral">
                <span className="textIniciar">Iniciar</span>
                <span className="svg">{/* SVG omitido */}</span>
              </IonButton>
            </IonCol>
            <IonCol id="d2">
              <IonButton id="btnAlerta" onClick={handlePopoverClick}>
                <IonIcon icon={alertCircle} id="iconeAlerta" />
              </IonButton>
              <IonPopover
                isOpen={popoverVisible}
                event={popoverEvent}
                onDidDismiss={closePopover}
                className="popoverGeral"
              >
                <div id="branco">
                  <IonButton onClick={closePopover} id="btnFechar">
                    <IonIcon icon={close} id="iconeFechar" />
                  </IonButton>
                  <p>
                    O modo de revisão geral apresenta todos os flashcards do dia que devem ser
                    revisados (independente da matéria), para que você possa treinar todas as
                    matérias!
                  </p>
                </div>
              </IonPopover>
            </IonCol>
            <IonCol className="colFlex">
              <svg viewBox="0 0 250 250" className="circular-progress">
                <circle
                  className="bg"
                  cx="125"
                  cy="125"
                  r="115"
                  fill="none"
                  stroke="#ddd"
                  strokeWidth="20"
                />
                <circle
                  className="fg"
                  cx="125"
                  cy="125"
                  r="115"
                  fill="none"
                  stroke="#5394fd"
                  strokeWidth="20"
                  strokeDasharray="361.25 361.25"
                />
              </svg>
            </IonCol>
          </IonRow>
          <IonRow id="divisoes">
              <IonRow id="linhaDecks">
                <p id="pDecks">Decks atuais</p>
              </IonRow>
          </IonRow>
          <IonRow id="estatisticas">
            <div className="estDivs">
              <IonRow className="espDiv">
                <IonCol className="altD">
                  <p className="txtGrande">200</p>
                </IonCol>
                <IonCol className="altD iconFim">
                  <IonIcon icon={layers} className="iconesTF" />
                </IonCol>
              </IonRow>
              <IonRow>
                <p className="txtTF">Total de cards</p>
              </IonRow>
            </div>
            <div className="estDivs">
              <IonRow className="espDiv">
                <IonCol className="altD">
                  <p className="txtGrande">3</p>                
                </IonCol>
                <IonCol className="altD iconFim">
                  <IonIcon icon={library} className="iconesTF" />
                </IonCol>
              </IonRow>
              <IonRow>
                <p className="txtTF">Matérias para estudar</p>
              </IonRow>
            </div>
            <div className="estDivs">
              <IonRow className="espDiv">
                <IonCol className="altD">
                  <p className="txtGrande">16</p>                 
                </IonCol>
                <IonCol className="altD iconFim">
                  <IonIcon icon={time} className="iconesTF" />
                </IonCol>
              </IonRow>
              <IonRow>
                <p className="txtTF">Para revisar hoje</p>
              </IonRow>
            </div>
          </IonRow>
          <IonRow id="decks" className="p0">
            {materias.length > 0 ? (
              materias.map((materia) => {
                const topicosDaMateria = topicos.filter(t => t.materia_id === materia.id);
                const progresso = 50; 
                const estaExpandida = materiaExpandidaId === materia.id;

                return (
                  <IonCol key={materia.id} className="materia-itemF">
                    <IonLabel>
                      <IonRow className="containerMateria">
                        <IonIcon icon={library} className="livroF" />
                        <IonCol className="td centro">
                          <h2>{materia.nome}</h2>
                        </IonCol>
                        <IonCol className="iconFim">
                          <IonButton
                            id={`config-btn-${materia.id}`}
                            className="verTopicos"
                            onClick={() => toggleExpandirMateria(materia.id)}
                          >
                            {estaExpandida ? 'Esconder tópicos' : 'Ver tópicos'}
                          </IonButton>
                        </IonCol>
                      </IonRow>
                      <IonRow className="espDC">
                        <p className="txtWC">10 cards</p>
                        <p className="txtWC" id="txtRevisar">5 para revisar</p>
                      </IonRow>
                      <IonRow className="barra">
                        <div className="barraStatus" style={{ width: `${progresso}%` }}></div>
                      </IonRow>
                      <IonRow className="larguraC">
                        <IonButton id="btnEstudar" onClick={(e) => {e.stopPropagation()}}>Estudar</IonButton>
                        <IonButton id="btnMais" onClick={(e) => {e.stopPropagation()}}>+</IonButton>
                      </IonRow>
                    </IonLabel>

                    {estaExpandida && (
                      <div className="listaTopicos">
                        {topicosDaMateria.length > 0 ? (
                          topicosDaMateria.map(topico => (
                            <IonRow className="contSetaTopico"
                              key={topico.id} 
                            >
                              <IonIcon 
                                icon={arrowForward} 
                                className="setaTopico"  
                              />
                              <p className="txtTopico">
                                {topico.titulo}
                              </p>
                            </IonRow>
                          ))
                        ) : (
                          <p>Você ainda não criou nenhum tópico :(</p>
                        )}
                      </div>
                    )}
                  </IonCol>
                );
              })
            ) : (
              <p>Nenhuma matéria disponível.</p>
            )}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default TelaInicialFlashcards;
