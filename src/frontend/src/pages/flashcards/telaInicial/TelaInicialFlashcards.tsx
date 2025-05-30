import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonIcon, IonButton, IonPopover, IonGrid, IonRow, IonCol, IonLabel } from '@ionic/react';
import Header from '../../../components/Header';
import { alertCircle, school, close, chevronDown, chevronUp, layers, time, library } from 'ionicons/icons';
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
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);
  const [popoverEvent, setPopoverEvent] = useState<any>(undefined);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [expandedMaterias, setExpandedMaterias] = useState<{ [key: number]: boolean }>({});

  const handlePopoverClick = (event: React.MouseEvent) => {
    setPopoverEvent(event.nativeEvent);
    setPopoverVisible(true);
  };

  const closePopover = () => {
    setPopoverVisible(false);
  };

  const toggleExpand = (id: number) => {
    setExpandedMaterias((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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

  return (
    <IonPage className="pagina">
      <Header />
      <IonContent style={{ background: '#fff' }}>
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
              const topicosDaMateria = topicos.filter((t) => t.materia_id === materia.id);
              const progresso = 50; 

            return (
              <div key={materia.id} className="materia-itemF">
                <IonLabel>
                  <IonRow className="containerMateria">
                    <IonIcon icon={library} className="livroF" />
                    <IonCol className="td centro">
                      <h2>{materia.nome}</h2>
                    </IonCol>
                    <IonCol className="td">
                      <IonButton
                        fill="clear"
                        onClick={() => toggleExpand(materia.id)}
                      >
                      </IonButton>
                    </IonCol>
                    <IonCol className="iconFim">
                      <IonButton
                      id={`config-btn-${materia.id}`}
                      className="config"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPopoverEvent(e.nativeEvent);
                        setPopoverVisible(true);
                      }}
                    >
                      ...
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
                    <IonButton id="btnEstudar">Estudar</IonButton>
                    <IonButton id="btnMais">+</IonButton>
                  </IonRow>
                </IonLabel>
              </div>
            );
              })
            ) : (
              <p style={{ padding: '1rem' }}>
                <i>Nenhuma matéria disponível.</i>
              </p>
            )}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default TelaInicialFlashcards;
