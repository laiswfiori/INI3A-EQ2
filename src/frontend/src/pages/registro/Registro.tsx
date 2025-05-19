import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import './css/geral.css';
import './css/layout.css';
import './css/ui.css';
import './../../components/Animacao.css';

interface RegistroProps {
  goToLogin: () => void;
}

const Registro: React.FC<RegistroProps> = ({ goToLogin }) => {
  const [name, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleCadastrar = async () => {
    setErro('');
    setMensagem('');

    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      console.log(password);

      const data = await response.json();

      if (response.ok) {
        setMensagem('Cadastro realizado com sucesso!');
        setNome('');
        setEmail('');
        setSenha('');
      } else {
        setErro(data.mensagem || 'Erro ao cadastrar usuário.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setErro('Erro de conexão com o servidor.');
    }
  };

  
  return (
        <div id="body">
          <div className="cadastro-container">
            <div className="div1">
              <h1><b>Cadastre-se em nossa plataforma!</b></h1><br />
              <IonButton className="btnGoogle"><b>Continue com o Google</b></IonButton><br />
              <div id="ou">
                  <div className="linhas"><p className="txtLinha">la</p></div>
                  <h3 id="txtOu">Ou</h3>
                  <div className="linhas"></div>
              </div>
              <p id="label1"><b>Nome</b></p>
              <input 
                type="text"
                value={name}
                onChange={(e) => setNome(e.target.value)}
                /><br /><br />
              <p id="label1"><b>Email</b></p>
              <input
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                /><br /><br />
              <p id="label1"><b>Senha</b></p>
              <input
                type="password"
                value={password}
                onChange={(e) => setSenha(e.target.value)}
                /><br /><br />
              <IonButton className="btnCadastrar" onClick={handleCadastrar}><b>Cadastrar</b></IonButton><br />
              <h3 id="direita">Já possui uma conta?
              <IonButton className="btnLogin" onClick={goToLogin}>Faça login</IonButton>
              </h3>
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
  );
};


export default Registro;
