import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonIcon, IonButton, IonPopover, IonGrid, IonRow, IonCol } from '@ionic/react';
import Header from '../../../components/Header';
import { alertCircle, school, close, chevronDown, chevronUp } from 'ionicons/icons';
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

          <IonRow id="decks" className="p0">
            <IonCol className="p0">
              {materias.length > 0 ? (
                materias.map((materia) => {
                  const topicosDaMateria = topicos.filter((t) => t.materia_id === materia.id);

                  return (
                    <div key={materia.id}>
                      <IonButton
                        type="button"
                        expand="block"
                        onClick={() => toggleExpand(materia.id)}
                        className="listaTopicos botaoMateria"
                      >
                        <span className="largura">{materia.nome}
                          <IonIcon icon={expandedMaterias[materia.id] ? chevronUp : chevronDown} />
                        </span>
                      </IonButton>

                      {expandedMaterias[materia.id] && (
                        <ul className="listaTopicos">
                          {topicosDaMateria.length > 0 ? (
                            topicosDaMateria.map((topico) => (
                              <li key={topico.id}>
                                <div className="topico-box">{topico.titulo}</div>
                              </li>
                            ))
                          ) : (
                            <li className="listaTopicos">
                              <i>Sem tópicos criados :(</i>
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  );
                })
              ) : (
                <p style={{ padding: '1rem' }}>
                  <i>Nenhuma matéria disponível.</i>
                </p>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default TelaInicialFlashcards;
