import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import './css/geral.css';
import './css/layout.css';
import './css/ui.css';
import './../../components/Animacao.css';




const Registro: React.FC = () => {
  return (
        <div id="body">
          <div className="cadastro-container">
            {/* div1 - formulário */}
            <div className="div1">
              <h1><b>Cadastre-se em nossa plataforma!</b></h1><br />
              <IonButton className="botao"><b>Continue com o Google</b></IonButton><br />
              <h3>ou:</h3><br />
              <input type="email" placeholder="Digite seu email" /><br /><br />
              <input type="password" placeholder="Digite sua senha" /><br /><br />
              <IonButton className="botao"><b>Cadastrar</b></IonButton><br />
              <h4>Já possui uma conta?
                <a href="/login/login"><b> Faça login!</b></a>
              </h4>
            </div>


            {/* ✅ div2 - animação com texto */}
            <div className="div2">
              <div className="bola bola1"></div>
              <div className="bola bola2"></div>
              <div className="bola bola3"></div>
              <div id="org">
              <h1>Seja bem-vindo à <b>melhor</b> plataforma de estudos!</h1>
              <div id="img">
                <img src="/imgs/logoSemFundo.png" alt="Logo png" />
              </div>
              </div>
            </div>
          </div>
        </div>
  );
};


export default Registro;
