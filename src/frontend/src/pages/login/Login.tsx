import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonRow, IonLabel } from '@ionic/react';
import './css/geral.css';
import './css/ui.css';
import './css/layout.css';
import Animacao from '../../components/Animacao';

interface LoginProps {
  goToCadastro: () => void;
}

const Login: React.FC<LoginProps> = ({ goToCadastro }) => {

  return (
      <div id="bodyLogin">
        <div className="loginContainer">
            <div className="div1">
                <div id="apresentacao">
                <IonRow><h1><b>Sentimos saudades!</b></h1></IonRow>
                <IonRow><h2>Pronto para começar?</h2></IonRow>
                </div>
                <div id="img">
                <img src="/imgs/logoSemFundo.png" alt="Logo png" />
              </div>
                <div className="bola bola1"></div>
                <div className="bola bola2"></div>
                <div className="bola bola3"></div>
            </div>

            <div className="div2">
                <h1><b>Login</b></h1>
                <h3 id="conta"> Não possui uma conta?
                <IonButton onClick={goToCadastro} className="btnCadastrar">Cadastre-se</IonButton>
                </h3>
                <p><b>Email</b></p>
                <input type="email" placeholder="Digite seu email" className="inputForm"/>
                <p><b>Senha</b></p>
                <input type="password" placeholder="Digite sua senha" className="inputForm"/>
                <h3 className="info">Esqueci minha senha</h3>
                <IonButton className="btnEntrar">Entrar</IonButton>
                <div id="ou">
                  <div className="linhas"></div>
                  <h3 id="txtOu" >Ou</h3>
                  <div className="linhas"></div>
                </div>
               
                <IonButton className="btnGoogle">Continuar com Google</IonButton>
            </div>
        </div>
      </div>
  );
};


export default Login;
