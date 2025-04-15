import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonRow } from '@ionic/react';
import './registro.css';

const Registro: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cadastro</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="cadastro-container">
            <div className="div1">
                <h1>Cadastre-se em nossa plataforma!</h1>
                <IonButton expand="full">Continue com o Google</IonButton>
                ou:
                <input type="email" placeholder="Digite seu email" />
                <input type="password" placeholder="Digite sua senha" />
                <IonButton expand="full">Cadastrar</IonButton>
                <h3>Já possui uma conta? Faça login!</h3>
            </div>
            <div className="div2">
                <h1>Seja bem-vindo a melhor plataforma de estudos!</h1>
            </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Registro;