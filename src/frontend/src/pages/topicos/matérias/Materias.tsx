import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import Header from '../../../components/Header';

const Materias: React.FC = () => {
  return (
    <IonPage>
      <Header />
      <IonContent>
        {/* Aqui vai o conteúdo dos flashcards */}
      </IonContent>
    </IonPage>
  );
};

export default Materias;