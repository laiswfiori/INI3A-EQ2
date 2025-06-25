import React from 'react';
import { IonPage, IonContent, IonRow, IonCol, IonIcon, IonInput, IonButton } from '@ionic/react';
import { mail, returnDownBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './css/geral.css';
import './css/ui.css';
import './css/layouts.css';

const Confirmar: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage className="paginaSenha">
      <IonContent className="pagS">
        <IonRow className="contVoltar"  onClick={() => history.push('/logincadastro/logincadastro')}>
          <IonIcon icon={returnDownBack} className="email"/>
          <p>Voltar para login</p>
        </IonRow>
        <IonRow className='whs'>
          <IonCol className="centroS configM">
            <h1 className="preto titSenha">Esqueceu sua senha?</h1>
            <p className="pSenha">Insira seu email para receber a mensagem de recuperação de senha.</p>
            <IonRow className="contInputEmail">
              <IonRow className="centroHorizontal">
                <IonCol size="auto" id="divAzul">
                  <IonIcon icon={mail} className="email"/>
                </IonCol>
                <IonCol>
                  <p id="txtS">Você receberá um email em sua conta, contatendo um link para a atualização da senha. Ele pode estar no span.</p>
                </IonCol>
              </IonRow>
              <IonRow className="larguraS">
                <IonCol className="larguraS2">
                  <IonInput
                    placeholder="Seu email"
                    className="input btnSenhas"
                  />
                </IonCol>
              </IonRow>
            </IonRow>
            <IonButton className="btnEnviar">Enviar</IonButton>
          </IonCol>
          <IonCol id="imgInicio">
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Confirmar;