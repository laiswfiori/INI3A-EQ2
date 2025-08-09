import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IonButton, IonRow, IonIcon, useIonToast } from '@ionic/react';
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

  const [emailError, setEmailError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [formValid, setFormValid] = useState(false);
  const [showRequiredFieldsMsg, setShowRequiredFieldsMsg] = useState(false);

  const navHome = () => {
    history.push('/pagInicial/home');
  };

  useEffect(() => {
    let valid = true;
    let anyEmptyField = false;

    // Verificação de campos obrigatórios
    if (!name.trim() || !surname.trim() || !email.trim() || !password.trim()) {
      anyEmptyField = true;
      valid = false;
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('');
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Insira um email válido.');
      valid = false;
    } else if (email.includes(' ')) {
      setEmailError('O email não pode conter espaços.');
      valid = false;
    } else {
      setEmailError('');
    }

    // Senha
    const errors: string[] = [];
    if (password) {
      if (password.length < 8) {
        errors.push('A senha deve conter pelo menos 8 caracteres.');
        valid = false;
      }
      if (!/[A-Z]/.test(password)) {
        errors.push('A senha deve conter pelo menos 1 letra maiúscula.');
        valid = false;
      }
      if (!/[!@#$%^&*(),.?":{}|<>_]/.test(password)) {
        errors.push('A senha deve conter pelo menos 1 caractere especial.');
        valid = false;
      }
      if (/\s/.test(password)) {
        errors.push('A senha não pode conter espaços.');
        valid = false;
      }
    }
    setPasswordErrors(errors);

    setShowRequiredFieldsMsg(anyEmptyField);
    setFormValid(valid && !anyEmptyField);
  }, [name, surname, email, password]);

  const handleCadastrar = async () => {
    setErro('');
    setMensagem('');

    const api = new API();

    const novoUsuario = {
      name: name.trim(),
      surname: surname.trim(),
      email: email.trim().toLowerCase(),
      password,
    };

    api.post('api/register', novoUsuario)
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
  };

  return (
    <div id="body">
      <div className="cadastro-container">

        <IonRow className="contVoltar" onClick={() => history.push('/pagInicial/home')}>
          <IonIcon icon={returnDownBack} className="voltar" />
        </IonRow>

        <div className="div1">
          <h1 className="h1"><b>Cadastre-se em nossa plataforma!</b></h1><br />
          <IonButton className="btnGoogle"><h3 className="h3"><b>Continue com o Google</b></h3></IonButton><br />

          <div id="ou">
            <div className="linhas"></div>
            <h3 className="h3">Ou</h3>
            <div className="linhas"></div>
          </div>

          {showRequiredFieldsMsg && (
            <p className="mustError">* Todos os campos são obrigatórios.</p>
          )}

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
            maxLength={254}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="nameError">{emailError}</p>}

          <h2 className="h2"><b>Senha</b></h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setSenha(e.target.value)}
          />
          {passwordErrors.length > 0 && (
            <ul className="nameError">
              {passwordErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          )}

          <IonButton
            className="h3 btnCadastrar"
            onClick={handleCadastrar}
            disabled={!formValid}
          >
            <b>Cadastrar</b>
          </IonButton><br />

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
  );
};

export default Registro;
