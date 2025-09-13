import React, { useState, useEffect } from 'react';
import { loginUser, loginWithGoogle } from '../../lib/endpoints';
import { useHistory } from 'react-router-dom';
import { IonPage, IonButton, IonRow, IonIcon } from '@ionic/react';
import { returnDownBack } from 'ionicons/icons';
import './css/geral.css';
import './css/ui.css';
import './css/layout.css';
import './../../components/Animacao.css';
import  AnimacaoSVG  from '../../components/AnimacaoSVG';

declare global {
  interface Window {
    google: any;
  }
}

interface LoginProps {
  goToCadastro: () => void;
}

const Login: React.FC<LoginProps> = ({ goToCadastro }) => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [formValid, setFormValid] = useState(false);
  const [requiredFieldsError, setRequiredFieldsError] = useState('');

  useEffect(() => {
    let valid = true;
    setRequiredFieldsError('');

    // Verifica se todos os campos foram preenchidos
    if (!email.trim() || !password) {
      setRequiredFieldsError('*Todos os campos são obrigatórios.');
      valid = false;
    }

    // Validação do email (apenas se preenchido)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() && !emailRegex.test(email.trim())) {
      setEmailError('Insira um email válido.');
      valid = false;
    } else {
      setEmailError('');
    }

    // Validação da senha (apenas se preenchida)
    const errors: string[] = [];
    if (password) {
      if (password.length < 8) errors.push('A senha deve conter pelo menos 8 caracteres.');
      if (!/[A-Z]/.test(password)) errors.push('A senha deve conter pelo menos 1 letra maiúscula.');
      if (!/[!@#$%^&*(),.?":{}|<>_]/.test(password)) errors.push('A senha deve conter pelo menos 1 caractere especial.');
      if (/\s/.test(password)) errors.push('A senha não pode conter espaços.');
      if (errors.length > 0) valid = false;
    } else {
      // Se a senha estiver vazia, já tratamos acima (requiredFieldsError)
      // Então limpa os erros específicos da senha
      setPasswordErrors([]);
    }
    setPasswordErrors(errors);

    setFormValid(valid);
  }, [email, password]);

  const handleLogar = async () => {
    setErro('');
    try {
      const data = await loginUser({ email: email.trim(), password });

      if (data && data.access_token) {
        console.log('Usuário logado com sucesso:', data);
        localStorage.setItem('token', data.access_token);
        history.replace('/pagInicial/home');
        window.location.reload();
      } else {
        setErro('Credenciais inválidas.');
      }
    } catch (error: any) {
      console.error('Erro na requisição de login:', error);
      const errorMessage = error.data?.message || 'Erro ao fazer login. Verifique suas credenciais.';
      setErro(errorMessage);
    }
  };

  const handleGoogleCredentialResponse = async (googleResponse: any) => {
    setErro('');
    try {
      const data = await loginWithGoogle(googleResponse.credential);
      if (data && data.access_token) {
        console.log('Usuário logado/cadastrado com sucesso via Google:', data);
        localStorage.setItem('token', data.access_token);
        history.replace('/pagInicial/home');
        window.location.reload();
      } else {
        throw new Error("A resposta do servidor não continha um token de acesso.");
      }
    } catch (error: any) {
      const errorMessage = error.data?.message || error.message || 'Falha na autenticação com Google.';
      setErro(errorMessage);
      console.error('Erro na requisição ao backend:', error);
    }
  };

  useEffect(() => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: '1094556818868-ol27r3asqj39iu9mnm3tp5dfidpm4gar.apps.googleusercontent.com',
        callback: handleGoogleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: 'outline', size: 'large', type: 'standard', text: 'continue_with', shape: 'pill', logo_alignment: 'left' }
      );
    }
  }, []);

  return (
    <IonPage>
      <div id="bodyLogin">
        <div className="loginContainer">
          <IonRow className="contVoltar" onClick={() => history.replace('/pagInicial/home')}>
            <IonIcon icon={returnDownBack} className="voltar1" />
          </IonRow>
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

            {/* Mensagem geral de campos obrigatórios */}
            {requiredFieldsError && (
              <p className="nameError2" style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
                {requiredFieldsError}
              </p>
            )}

            {/* Mensagem de erro do backend */}
            {erro && (
              <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
                {erro} 
              </p>
            )}

            <h2 className="h22"><b>Email</b></h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="inputForm1"
            />
            {/* Apenas erro de formato do email */}
            {emailError && <p className="nameError2">{emailError}</p>}

            <h2 className="h22"><b>Senha</b></h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setSenha(e.target.value)}
              className="inputForm1"
            />
            {/* Erros específicos da senha */}
            {passwordErrors.length > 0 && (
              <ul className="nameError2">
                {passwordErrors.map((err, idx) => <li key={idx}>{err}</li>)}
              </ul>
            )}

            <h3 className="h33 obs2" onClick={() => history.replace('/senha/confirmar')}>Esqueci minha senha</h3>
            <IonButton className="btnEntrar" onClick={handleLogar} disabled={!formValid}>
              <h3 className='h33'>Entrar</h3>
            </IonButton>
            <div id="ou1">
              <div className="linhass"></div>
              <h3 className="h33" id="txtOu1" >Ou</h3>
              <div className="linhass"></div>
            </div>
            <div id="googleSignInDiv" style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}></div>
          </div>
        </div>
      </div>
    </IonPage>
  );
};

export default Login;
