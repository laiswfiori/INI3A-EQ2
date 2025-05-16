import React, { useState, useEffect} from 'react';
import { IonPage, IonContent, IonIcon, IonButton, IonPopover, IonGrid, IonRow, IonCol } from '@ionic/react';
import Header from '../../../components/Header';
import { alertCircle, school, close, chevronDown, chevronUp } from 'ionicons/icons';
import './css/geralTelaInicial.css';
import './css/uiTelaInicial.css';
import './css/layoutsTelaInicial.css';
import './css/pie.css';

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
    fetch('http://localhost:8000/materias')
      .then((res) => res.json())
      .then(setMaterias)
      .catch((err) => console.error('Erro ao buscar matérias:', err));

    fetch('http://localhost:8000/topicos')
      .then((res) => res.json())
      .then(setTopicos)
      .catch((err) => console.error('Erro ao buscar tópicos:', err));
  }, []);

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
                <span className="svg">
                  {/* SVG omitido para brevidade */}
                </span>
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

          <IonRow id="decks">
            <IonCol>
              {materias.map((materia) => {
                const topicosDaMateria = topicos.filter((t) => t.materia_id === materia.id);

                return (
                  <div key={materia.id}>
                    <IonButton
                      type="button"
                      expand="block"
                      onClick={() => toggleExpand(materia.id)}
                      color="light"
                      className="listaTopicos"
                    >
                      <span>{materia.nome}</span>
                      <IonIcon icon={expandedMaterias[materia.id] ? chevronUp : chevronDown} />
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
              })}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default TelaInicialFlashcards;
