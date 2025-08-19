import React from 'react';
import { IonCard, IonCardContent, IonIcon } from '@ionic/react'; // Importe IonIcon
import { arrowBack } from 'ionicons/icons'; // Importe o ícone de seta
import './css/cardFlip.css';

interface CardProps {
  frente: React.ReactNode;
  verso: React.ReactNode;
  mostrarVerso: boolean;
  onVoltarFrente?: () => void; // Coloquei esse prop opcional para o botão de voltar
}

const CardFlip: React.FC<CardProps> = ({ frente, verso, mostrarVerso, onVoltarFrente }) => {
  return (
    <div className={`card-container ${mostrarVerso ? 'flipped' : ''}`}>
      <IonCard className="card-front">
        <IonCardContent>{frente}</IonCardContent>
      </IonCard>
      <IonCard className="card-back">
        <IonCardContent>
          {mostrarVerso && onVoltarFrente && ( // mostra o botão só no verso e se a prop for fornecida
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