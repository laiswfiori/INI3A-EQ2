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
  const [surname, setSobrenome] = useState('');
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
        body: JSON.stringify({ name, surname, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem('Cadastro realizado com sucesso!');
        setNome('');
        setSobrenome('');
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
            <IonImg className="imgSize" src="/imgs/voltar.png" alt="Voltar png" onClick={navHome}/>
            <IonImg className="imgSize"src="/imgs/home.png" alt="Home png" onClick={navHome}/>
          </div>

            <div className="div1">
              <h1 className="h1"><b>Cadastre-se em nossa plataforma!</b></h1><br />
              <IonButton className="btnGoogle"><h3 className="h3"><b>Continue com o Google</b></h3></IonButton><br />

              <div id="ou">
                  <div className="linhas"></div>
                  <h3 className="h3">Ou</h3>
                  <div className="linhas"></div>
              </div>

              <h2 className="h2"><b>Nome</b></h2>
              <input 
                type="text"
                value={name}
                onChange={(e) => setNome(e.target.value)}
                />
              <h2 className="h2"><b>Sobrenome</b></h2>
              <input 
                type="text"
                value={surname}
                onChange={(e) => setSobrenome(e.target.value)}
                />
              <h2 className="h2"><b>Email</b></h2>
              <input
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
              <h2 className="h2"><b>Senha</b></h2>
              <input
                type="password"
                value={password}
                onChange={(e) => setSenha(e.target.value)}
                />
              <IonButton className="h3 btnCadastrar" onClick={handleCadastrar}><b>Cadastrar</b></IonButton><br />
              <h3 className="h3" id="qt">Já possui uma conta?</h3>
              <IonButton className="h3 btnLogin" onClick={goToLogin}>Faça login</IonButton>
            </div>

            <div className="div2">
              <div className="bola bola1"></div>
              <div className="bola bola2"></div>
              <div className="bola bola3"></div>
              <div id="org">
              <h1 className="h1e">Seja bem-vindo à <b>melhor</b> plataforma de estudos!</h1>
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
