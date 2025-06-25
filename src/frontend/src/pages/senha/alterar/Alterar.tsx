import React from 'react';
import { IonPage, IonContent, IonRow, IonCol, IonIcon, IonInput, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './css/geral.css';
import './css/ui.css';
import './css/layouts.css';

const Alterar: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage className="paginaSenha">
      <IonContent className="pagS">
        <IonRow className='whs'>
          <IonCol className="centroS configM">
            <h1 className="preto titSenha">Alterar a senha</h1>
            <p className="pSenha">Insira sua nova senha. Lembre-se de anotá-la!</p>
            <IonRow className="contInputEmail">
                  <IonInput
                    placeholder="Insira a senha."
                    className="input btnSenhas"
                  />
                  <IonInput
                    placeholder="Confirme a senha."
                    className="input btnSenhas"
                  />
            </IonRow>
            <IonButton className="btnEnviar" onClick={() => history.push('/senha/concluir')}>Alterar</IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Alterar;