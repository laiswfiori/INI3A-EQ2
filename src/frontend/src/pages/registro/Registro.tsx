import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonRow, IonImg } from '@ionic/react';
import './css/geral.css';
import './css/layout.css';
import './css/ui.css';
import './../../components/Animacao.css';
import Header from '../../components/Header';

interface RegistroProps {
  goToLogin: () => void;
}

const Registro: React.FC<RegistroProps> = ({ goToLogin }) => {
  const history = useHistory();
  const [name, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  const navHome = () => {
    history.push('/pagInicial/home');
  };

  const handleCadastrar = async () => {
    setErro('');
    setMensagem('');

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem('Cadastro realizado com sucesso!');
        setNome('');
        setEmail('');
        setSenha('');
        localStorage.setItem('token', data.token); 
        history.push('/pagInicial/home');
        window.location.reload();
      } else {
        setErro(data.mensagem || 'Erro ao cadastrar usuário.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setErro('Erro de conexão com o servidor.');
    }
  };

  
  return (
   //<IonPage>
     //<Header/>
        <div id="body">
          <div className="cadastro-container">
          <div className="voltar">
            <IonImg src="/imgs/voltar.png" alt="Voltar png" onClick={navHome}/>
            <IonImg src="/imgs/home.png" alt="Home png" onClick={navHome}/>
          </div>
          
            <div className="div1">
              <h1><b>Cadastre-se em nossa plataforma!</b></h1><br />
              <IonButton className="btnGoogle"><b>Continue com o Google</b></IonButton><br />
              <br></br>
              <div id="ou">
                  <div className="linhas"></div>
                  <h3 id="txtOu">Ou</h3>
                  <div className="linhas"></div>
              </div><br></br>
              <p id="label1"><b>Nome</b></p>
              <input 
                type="text"
                value={name}
                onChange={(e) => setNome(e.target.value)}
                /><br />
              <p id="label1"><b>Email</b></p>
              <input
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                /><br />
              <p id="label1"><b>Senha</b></p>
              <input
                type="password"
                value={password}
                onChange={(e) => setSenha(e.target.value)}
                /><br />
              <IonButton className="btnCadastrar" onClick={handleCadastrar}><b>Cadastrar</b></IonButton><br />
              <h3 id="direita">Já possui uma conta?</h3>
              <IonButton className="btnLogin" onClick={goToLogin}>Faça login</IonButton>
            </div>

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
    //</IonPage>
  );
};


export default Registro;
