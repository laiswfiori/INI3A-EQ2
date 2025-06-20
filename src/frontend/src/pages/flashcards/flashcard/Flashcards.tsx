import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import Header from '../../../components/Header';

const Flashcards: React.FC = () => {
  return (
    <IonPage className="pagina">
      <Header />
      <IonContent>
        <div id="body">
          <div className="flashcardContainer">
            <div className="titulo card">
              <div className="conteudo">
                <div className="frente">
                  <p>LALALALA</p>
                </div>
                <div className="verso">
                </div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Flashcards;