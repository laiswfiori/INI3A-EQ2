import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonRow, IonLabel } from '@ionic/react';
import './css/geral.css';
import './css/ui.css';
import './css/layout.css';
import './../../components/Animacao.css';
import Header from '../../components/Header';

interface LoginProps {
  goToCadastro: () => void;
}

const Login: React.FC<LoginProps> = ({ goToCadastro }) => {
  const [email, setEmail] = useState('');
  const [password, setSenha] = useState('');
  const [erro, setErro] = useState('');
  

  const handleLogar = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Usuário logado com sucesso:', data);
        
      } else {
        setErro(data.mensagem || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setErro('Erro de conexão com o servidor.');
    }
  };

  return (
    <IonPage>
    <Header />
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
                <input
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="inputForm"/>
                <p><b>Senha</b></p>
                <input
                  type="password" 
                  value={password}
                  onChange={(e) => setSenha(e.target.value)}
                  className="inputForm"/>
                <h3 className="info">Esqueci minha senha</h3>
                <IonButton className="btnEntrar" onClick={handleLogar}>Entrar</IonButton>
                <div id="ou">
                  <div className="linhas"></div>
                  <h3 id="txtOu" >Ou</h3>
                  <div className="linhas"></div>
                </div>
               
                <IonButton className="btnGoogle">Continuar com Google</IonButton>
            </div>
        </div>
      </div>
      </IonPage>
  );
};


export default Login;
