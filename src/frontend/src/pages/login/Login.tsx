import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonRow, IonLabel } from '@ionic/react';
import './login.css';

const Login: React.FC = () => {
  return (
    <IonPage>

      <IonContent>
        <div className="login-container">
            <div className="div1">
                <IonRow><h1>Sentimos saudades!</h1></IonRow>
                <IonRow><h2>Pronto para começar?</h2></IonRow>
            </div>

            <div className="div2">
                <IonRow><h1>Login</h1></IonRow>
                <IonRow><h3>Não possui uma conta? Cadastre-se!</h3></IonRow>
                <IonLabel><h3>Email</h3></IonLabel>
                <IonRow><input type="email" placeholder="Digite seu email" /></IonRow>
                <IonLabel><h3>Senha</h3></IonLabel>
                <IonRow><input type="password" placeholder="Digite sua senha" /></IonRow>
                <IonRow><h3>Esqueci minha senha</h3></IonRow>
                <IonButton expand="full">Entrar</IonButton>
                <IonRow><h3>ou</h3></IonRow>
                <IonButton expand="full">Continuar com Google</IonButton>
            </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
