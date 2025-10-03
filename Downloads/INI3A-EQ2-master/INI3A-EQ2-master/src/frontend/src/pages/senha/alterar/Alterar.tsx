import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonRow, IonCol, IonInput, IonButton, IonToast, IonLoading, useIonRouter} from '@ionic/react';
import { useLocation } from 'react-router-dom';
import { resetPassword } from '../../../lib/endpoints';

import './css/geral.css';
import './css/ui.css';
import './css/layouts.css';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Alterar: React.FC = () => {
  const query = useQuery();
  const ionRouter = useIonRouter();

  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [showLoading, setShowLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean, message: string, color: string }>({ show: false, message: '', color: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isSubmitted) return;

    const tokenFromUrl = query.get('token');
    const emailFromUrl = query.get('email');

    if (tokenFromUrl && emailFromUrl) {
      setToken(tokenFromUrl);
      setEmail(emailFromUrl);
    } else {
      setToast({ show: true, message: 'Link inválido ou incompleto.', color: 'danger' });
      setTimeout(() => ionRouter.push('/logincadastro/logincadastro', 'root', 'replace'), 2000);
    }
  }, [query, ionRouter, isSubmitted]);

  const handleSubmit = async () => {
    if (password !== passwordConfirmation) {
      setToast({ show: true, message: 'As senhas não coincidem.', color: 'danger' });
      return;
    }
    if (!token || !email) return;

    setShowLoading(true);
    try {
      const data = { token, email, password, password_confirmation: passwordConfirmation };
      const response = await resetPassword(data);

      setIsSubmitted(true);
      setShowLoading(false);
      setToast({ show: true, message: response.message || 'Senha redefinida com sucesso!', color: 'success' });

      setTimeout(() => ionRouter.push('/senha/concluir', 'root', 'replace'), 3000);

    } catch (error: any) {
      setShowLoading(false);
      const errorMessage = error.message || 'Não foi possível redefinir. O link pode ter expirado.';
      setToast({ show: true, message: errorMessage, color: 'danger' });
    }
  };

  return (
    <IonPage className="paginaSenha">
      <IonContent className="pagS">
        <IonLoading isOpen={showLoading} message={'Salvando...'} />
        <IonToast
          isOpen={toast.show}
          message={toast.message}
          color={toast.color}
          duration={3000}
          onDidDismiss={() => setToast({ show: false, message: '', color: '' })}
        />
        <IonRow className='whs'>
          <IonCol className="centroS configM">
            <h1 className="preto titSenha">Alterar a senha</h1>
            <p className="pSenha">Insira sua nova senha. Lembre-se de anotá-la!</p>
            <IonRow className="contInputEmail">
              <IonInput
                type="password"
                placeholder="Insira a nova senha."
                className="input btnSenhas"
                value={password}
                onIonChange={e => setPassword(e.detail.value!)}
                disabled={isSubmitted}
              />
              <IonInput
                type="password"
                placeholder="Confirme a senha."
                className="input btnSenhas"
                value={passwordConfirmation}
                onIonChange={e => setPasswordConfirmation(e.detail.value!)}
                disabled={isSubmitted}
              />
            </IonRow>
            <IonButton className="btnEnviar" onClick={handleSubmit} disabled={showLoading || isSubmitted}>
              Alterar
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Alterar;
