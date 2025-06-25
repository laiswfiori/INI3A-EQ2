import React from 'react';
import { IonPage, IonContent, IonRow, IonCol } from '@ionic/react';
import './css/geral.css';
import './css/ui.css';
import './css/layouts.css';

const Concluir: React.FC = () => {
  return (
    <IonPage className="paginaSenha">
      <IonContent>
        <IonRow className='whs'>
           <IonCol className="centroS configM">
              <h1 className="preto titSenha">Senha alterada com sucesso!</h1>
              <p className="pSenha">Ao retornar para o site, sua nova senha já estará registrada.</p>
            </IonCol>
            <IonCol id="imgFim">
            </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Concluir;