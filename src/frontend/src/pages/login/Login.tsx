import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonRow, IonLabel } from '@ionic/react';
import './login.css';

const Login: React.FC = () => {
  return (
    <IonPage>

      <IonContent>
      <div id="body">
        <div className="login-container">
            <div className="div1">
                <IonRow><h1><b>Sentimos saudades!</b></h1></IonRow>
                <IonRow><h3>Pronto para começar?</h3></IonRow>
                <div id="img">
                <img src="/imgs/logoSemFundo.png" alt="Logo png" />
                </div>

                <div className="bola bola1"></div>
                <div className="bola bola2"></div>
                <div className="bola bola3"></div>
            </div>

            <div className="div2">
                <h1><b>✨Login</b></h1>
                <h4>Não possui uma conta?
                  <a href="/registro/registro"><b>Cadastre-se!</b></a>
                </h4>
                <IonLabel><h3><b>Email</b></h3></IonLabel>
                <input type="email" placeholder="Digite seu email" />
                <IonLabel><h3><b>Senha</b></h3></IonLabel>
                <input type="password" placeholder="Digite sua senha" />
                <h4>Esqueci minha senha</h4>
                <IonButton className="botao">Entrar</IonButton>
                <h3>ou</h3>
                <IonButton className="botao">Continuar com Google</IonButton>
            </div>
        </div>
      </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
