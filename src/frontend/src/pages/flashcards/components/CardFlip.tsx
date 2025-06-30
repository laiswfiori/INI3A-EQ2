import React from 'react';
import { IonCard, IonCardContent } from '@ionic/react';
import './css/cardFlip.css';

interface CardProps {
  frente: React.ReactNode;
  verso: React.ReactNode;
  mostrarVerso: boolean; 
}

const CardFlip: React.FC<CardProps> = ({ frente, verso, mostrarVerso }) => {
  return (
    <div className={`card-container ${mostrarVerso ? 'flipped' : ''}`}>
      <IonCard className="card-front">
        <IonCardContent>{frente}</IonCardContent>
      </IonCard>
      <IonCard className="card-back">
        <IonCardContent>{verso}</IonCardContent>
      </IonCard>
    </div>
  );
};

export default CardFlip;
