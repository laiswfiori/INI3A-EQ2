import React from 'react';
import { IonCard, IonCardContent, IonIcon } from '@ionic/react'; 
import { arrowBack } from 'ionicons/icons'; 
import './css/cardFlip.css';

interface CardProps {
  frente: React.ReactNode;
  verso: React.ReactNode;
  mostrarVerso: boolean;
  onVoltarFrente?: () => void; 
  noAnim?: boolean;
}

const CardFlip: React.FC<CardProps> = ({ frente, verso, mostrarVerso, onVoltarFrente, noAnim }) => {
  return (
    <div className={`card-container ${mostrarVerso ? 'flipped' : ''} ${noAnim ? 'no-anim' : ''} animate-in`}>
      <IonCard className="card-front">
        <IonCardContent>{frente}</IonCardContent>
      </IonCard>
      <IonCard className="card-back">
        <IonCardContent>
          {mostrarVerso && onVoltarFrente && ( 
            <button className="back-to-front-button" onClick={onVoltarFrente}>
              <IonIcon icon={arrowBack} />
            </button>
          )}
          {verso}
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default CardFlip;