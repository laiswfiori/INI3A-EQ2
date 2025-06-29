import React from 'react';
import { IonPage, IonContent, IonRow, IonCol, IonIcon, useIonRouter } from '@ionic/react';
import { desktop } from 'ionicons/icons';
import './css/geral.css';
import './css/ui.css';
import './css/layouts.css';

const Concluir: React.FC = () => {
  const ionRouter = useIonRouter();

  return (
    <IonPage className="paginaSenha">
      <IonContent>
        <IonRow className='whs'>
           <IonCol className="centroS configM">
              <h1 className="preto titSenha">Senha alterada com sucesso!</h1>
              <p className="pSenha">Ao retornar para o site, sua nova senha já estará registrada.</p>
              <IonRow className="contLogin">
                <IonRow className="centroHorizontal">
                  <IonCol size="auto" id="divAzul">
                    <IonIcon icon={desktop} className="email"/>
                  </IonCol>
                  <IonCol>
                    <p id="txtS" onClick={() => ionRouter.push('/logincadastro/logincadastro', 'root', 'replace')}>
                      Ir para login
                    </p>
                  </IonCol>
                </IonRow>
              </IonRow>
            </IonCol>
            <IonCol id="imgFim">
            </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Concluir;