import React, { useState, useEffect } from 'react'; 
import { useHistory } from 'react-router-dom';
import { IonButton, IonRow, IonIcon } from '@ionic/react';
import { returnDownBack } from 'ionicons/icons';
import './css/geral.css';
import './css/layout.css';
import './css/ui.css';
import './../../components/Animacao.css';
import { registerUser, loginWithGoogle } from '../../lib/endpoints';
import  AnimacaoSVG  from '../../components/AnimacaoSVG';

declare global {
  interface Window {
    google: any;
  }
}

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
  const [emailError, setEmailError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [formValid, setFormValid] = useState(false);
  const [showRequiredFieldsMsg, setShowRequiredFieldsMsg] = useState(false);

  useEffect(() => {
    let valid = true;
    let anyEmptyField = false;

    if (!name.trim() || !surname.trim() || !email.trim() || !password.trim()) {
      anyEmptyField = true;
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() && !emailRegex.test(email.trim())) {
      setEmailError('Insira um email válido.');
      valid = false;
    } else {
      setEmailError('');
    }

    const errors: string[] = [];
    if (password) {
      if (password.length < 8) errors.push('A senha deve conter pelo menos 8 caracteres.');
      if (!/[A-Z]/.test(password)) errors.push('A senha deve conter pelo menos 1 letra maiúscula.');
      if (!/[!@#$%^&*(),.?":{}|<>_]/.test(password)) errors.push('A senha deve conter pelo menos 1 caractere especial.');
      if (/\s/.test(password)) errors.push('A senha não pode conter espaços.');
      if (errors.length > 0) valid = false;
    }
    setPasswordErrors(errors);

    setShowRequiredFieldsMsg(anyEmptyField);  // linha corrigida
    setFormValid(valid && !anyEmptyField);
  }, [name, surname, email, password]);

  const handleGoogleCredentialResponse = async (googleResponse: any) => {
    setErro('');
    try {
      const data = await loginWithGoogle(googleResponse.credential);
      if (data && data.access_token) {
        localStorage.setItem('token', data.access_token);
        history.replace('/pagInicial/home');
        window.location.reload();
      } else {
        throw new Error("A resposta do servidor não continha um token de acesso.");
      }
    } catch (error: any) {
      const errorMessage = error.data?.message || error.message || 'Falha na autenticação com Google.';
      setErro(errorMessage);
    }
  };

  useEffect(() => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: '1094556818868-ol27r3asqj39iu9mnm3tp5dfidpm4gar.apps.googleusercontent.com',
        callback: handleGoogleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDivRegistro"),
        { theme: 'outline', size: 'large', type: 'standard', text: 'signup_with', shape: 'pill', logo_alignment: 'left' }
      );
    }
  }, []);

  const handleCadastrar = async () => {
    setErro('');
    const novoUsuario = {
      name: name.trim(),
      surname: surname.trim(),
      email: email.trim().toLowerCase(),
      password,
      password_confirmation: password
    };
    try {
      const data = await registerUser(novoUsuario);
      if (data && data.access_token) {
        localStorage.setItem('token', data.access_token);
        history.replace('/configuracoes/configuracoes');
        window.location.reload();
      }
    } catch (error: any) {
      const errorData = error.data;
      if (errorData?.email) setErro(errorData.email[0]);
      else if (errorData?.password) setErro(errorData.password[0]);
      else setErro('Erro ao cadastrar usuário.');
    }
  };

  return (
    <div id="body">
      <div className="cadastro-container">
        <IonRow className="contVoltar" onClick={() => history.replace('/pagInicial/home')}>
          <IonIcon icon={returnDownBack} className="voltar" />
        </IonRow>
        <div className="div1">
          <h1 className="h1"><b>Cadastre-se em nossa plataforma!</b></h1><br />
          <div id="googleSignInDivRegistro" className="btnGoogle" style={{ display: 'flex', justifyContent: 'center' }}></div><br />
          <div id="ou">
            <div className="linhas"></div>
            <h3 className="h3">Ou</h3>
            <div className="linhas"></div>
          </div>
          {erro && <p className="nameError" style={{ textAlign: 'center' }}>{erro}</p>}
          {showRequiredFieldsMsg && <p className="mustError">* Todos os campos são obrigatórios.</p>}
          
          <h2 className="h2"><b>Nome</b></h2>
          <input type="text" value={name} onChange={(e) => setNome(e.target.value)} />
          
          <h2 className="h2"><b>Sobrenome</b></h2>
          <input type="text" value={surname} onChange={(e) => setSobrenome(e.target.value)} />

          <h2 className="h2"><b>Email</b></h2>
          <input type="email" value={email} maxLength={254} onChange={(e) => setEmail(e.target.value)} />
          {emailError && <p className="nameError">{emailError}</p>}

          <h2 className="h2"><b>Senha</b></h2>
          <input type="password" value={password} onChange={(e) => setSenha(e.target.value)} />
          {passwordErrors.length > 0 && (
            <ul className="nameError">
              {passwordErrors.map((err, idx) => <li key={idx}>{err}</li>)}
            </ul>
          )}

          <IonButton className="h3 btnCadastrar" onClick={handleCadastrar} disabled={!formValid}>
            <b>Cadastrar</b>
          </IonButton><br />
          <h3 className="h3" id="qt">Já possui uma conta?</h3>
          <IonButton className="h3 btnLogin" onClick={goToLogin}>Faça login</IonButton>
        </div>
        <div className="div2">
           <div id="apresentacao">
              <h1 className="h1"><b>Seja bem-vindo!</b></h1><br></br><br></br>
              <h2 className="h2">Venha explorar um mundo de possibilidades!</h2>
              <div id="img">
                <img src="/imgs/logoSemFundo.png" alt="Logo png" />
              </div>
            </div>
            <div className="bola bola1"></div>
            <div className="bola bola2"></div>
            <div className="bola bola3"></div>
        </div>
      </div>
    </div>
  );
};

export default Registro;
