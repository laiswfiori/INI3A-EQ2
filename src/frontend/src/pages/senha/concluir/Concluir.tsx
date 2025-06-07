import React from 'react';
import { IonPage, IonContent, IonRow, IonCol, IonIcon, IonInput, IonButton } from '@ionic/react';
import './css/geral.css';
import './css/ui.css';
import './css/layouts.css';

const Concluir: React.FC = () => {
  return (
    <IonPage className="paginaSenha">
      <IonContent className="pagS">
        <IonRow className='whs'>
          <IonRow className="contSflex">
            <h1 className="preto titSenha">Sua senha foi alterada com sucesso!</h1>
            <p className="pSenhaConc"> Você já pode retornar ao site!</p>
          </IonRow>
          <IonRow id="imgFim">
          </IonRow>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Concluir;