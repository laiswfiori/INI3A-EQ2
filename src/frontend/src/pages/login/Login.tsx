import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, IonImg, IonButton} from '@ionic/react';
import './css/geral.css';
import './css/ui.css';
import './css/layout.css';
import './../../components/Animacao.css';

interface LoginProps {
  goToCadastro: () => void;
}

  const Login: React.FC<LoginProps> = ({ goToCadastro }) => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const navHome = () => {
    history.push('/pagInicial/home');
  };

  const handleLogar = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Usuário logado com sucesso:', data);
        localStorage.setItem('token', data.token); 
        history.push('/pagInicial/home');
        window.location.reload();
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
      <div id="bodyLogin">
        <div className="loginContainer">
          <div className="voltar1">
            <IonImg className="imgSize1" src="/imgs/voltar.png" alt="Voltar png" onClick={navHome}/>
            <IonImg className="imgSize1"src="/imgs/home.png" alt="Home png" onClick={navHome}/>
          </div>
            <div className="div11">
                <div id="apresentacao">
                <h1 className="h11"><b>Sentimos saudades!</b></h1>
                <h2 className="h22">Pronto para começar?</h2>
                <div id="img1">
                  <img src="/imgs/logoSemFundo.png" alt="Logo png" />
                </div>
            </div>
                <div className="bolas bola11"></div>
                <div className="bolas bola22"></div>
                <div className="bolas bola33"></div>
            </div>

            <div className="div22">
                <h1 className="h11"><b>Login</b></h1>
                <h3 className="h33 obs" id="conta"> Não possui uma conta?</h3>
                <IonButton onClick={goToCadastro} className="btnCadastrar1"><h3 className='h33'>Cadastre-se</h3></IonButton>
                <h2 className="h22"><b>Email</b></h2>
                <input
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="inputForm1"/>
                <h2 className="h22"><b>Senha</b></h2>
                <input
                  type="password" 
                  value={password}
                  onChange={(e) => setSenha(e.target.value)}
                  className="inputForm1"/>
                <h3 className="h33 obs2">Esqueci minha senha</h3>
                <IonButton className="btnEntrar" onClick={handleLogar}> <h3 className='h33'>Entrar</h3></IonButton>
                <div id="ou1">
                  <div className="linhass"></div>
                  <h3 className="h33" id="txtOu1" >Ou</h3>
                  <div className="linhass"></div>
                </div>
               
                <IonButton className="btnGoogle1"><h3 className='h33'>Continuar com Google</h3></IonButton>
            </div>
        </div>
      </div>
      </IonPage>
  );
};


export default Login;
