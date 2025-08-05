import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonRow, IonImg, IonIcon, useIonToast } from '@ionic/react';
import { returnDownBack } from 'ionicons/icons';
import './css/geral.css';
import './css/layout.css';
import './css/ui.css';
import './../../components/Animacao.css';
import API from '../../lib/api';

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
  const [presentToast] = useIonToast();
  
  const navHome = () => {
    history.push('/pagInicial/home');
  };

  const handleCadastrar = async () => {
  setErro('');
  setMensagem('');

  if (password.length > 7) {
    const api = new API();

    const novoUsuario = {
      name,
      surname,
      email,
      password,
    };

    api.post('api/register', novoUsuario) // <- incluído 'api/' aqui
      .then(data => {
        setMensagem('Cadastro realizado com sucesso!');
        setNome('');
        setSobrenome('');
        setEmail('');
        setSenha('');
        localStorage.setItem('token', data.token); 
        history.push('/configuracoes/configuracoes');
        window.location.reload();
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          console.error('Erro na requisição:', error.message);
          setErro(error.message);
        } else {
          console.error('Erro desconhecido:', error);
          setErro('Erro ao cadastrar usuário.');
        }
      });
  } else {
    presentToast({
      message: 'A senha deve ter pelo menos 8 algarismos.',
      duration: 3000,
      color: 'warning',
    });
  }
};


  
  return (
   //<IonPage>
     //<Header/>
        <div id="body">
          <div className="cadastro-container">

          <IonRow className="contVoltar"  onClick={() => history.push('/pagInicial/home')}>
             <IonIcon icon={returnDownBack} className="voltar"/>
          </IonRow>

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
