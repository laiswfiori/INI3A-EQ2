import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonRow, IonLabel } from '@ionic/react';
import './css/geral.css';
import './css/ui.css';
import './css/layout.css';
import './css/animation.css';

interface LoginProps {
  goToCadastro: () => void;
}

const Login: React.FC<LoginProps> = ({ goToCadastro }) => {

  return (
      <div id="bodyLogin">
        <div className="loginContainer">
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
                <h1 className="sizeLogin"><b>Login!</b></h1>
                <h4 className="size">Não possui uma conta?
                <IonButton onClick={goToCadastro}>Cadastre-se</IonButton>
                </h4>
                <p><b>Email</b></p>
                <input type="email" placeholder="@ Digite seu email" className="inputForm"/>
                <p><b>Senha</b></p>
                <input type="password" placeholder="Digite sua senha" className="inputForm"/>
                <h4 id="senha">Esqueci minha senha</h4>
                <IonButton className="botaoLogin">Entrar</IonButton>
                <div id="ou">
                  <div className="linhaOu"></div>
                  <h3 id="txtOu" >Ou</h3>
                  <div className="linhaOu"></div>
                </div>
               
                <IonButton className="botaoGoogle">Continuar com Google</IonButton>
            </div>
        </div>
      </div>
  );
};


export default Login;
