import React from 'react';
import { IonFooter, IonToolbar, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { calendar, star, documentText, personCircle } from 'ionicons/icons';

const Footer: React.FC = () => {
    console.log("Footer foi carregado");
  return (
    <IonFooter>
      <IonToolbar id="footer">
          <IonTabButton tab="agenda" href="#/agenda">
            <IonIcon icon={calendar} />
            <IonLabel>agenda</IonLabel>
          </IonTabButton>
          <IonTabButton tab="flashcards" href="#/flashcards">
            <IonIcon icon={star} />
            <IonLabel>flashcards</IonLabel>
          </IonTabButton>
          <IonTabButton tab="conteudos" href="#/conteudos">
            <IonIcon icon={documentText} />
            <IonLabel>conteúdos</IonLabel>
          </IonTabButton>
          <IonTabButton tab="perfil" href="#/perfil">
            <IonIcon icon={personCircle} />
            <IonLabel>perfil</IonLabel>
          </IonTabButton>
      </IonToolbar>
    </IonFooter>
  );
};

export default Footer;