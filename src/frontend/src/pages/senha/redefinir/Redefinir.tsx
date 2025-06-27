import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonToast, IonLoading, IonHeader, IonToolbar, IonTitle, useIonRouter } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import { resetPassword } from '../../../lib/endpoints';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

const RedefinirSenhaPage: React.FC = () => {
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
    if (isSubmitted) {
      return; 
    }

    const tokenFromUrl = query.get('token');
    const emailFromUrl = query.get('email');
    
    if (tokenFromUrl && emailFromUrl) {
      setToken(tokenFromUrl);
      setEmail(emailFromUrl);
    } else {
      setToast({ show: true, message: 'Link inválido ou incompleto.', color: 'danger' });
      // CORREÇÃO DA ROTA AQUI
      setTimeout(() => ionRouter.push('/logincadastro/logincadastro', 'root', 'replace'), 2000);
    }
  }, [query, ionRouter, isSubmitted]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
      
      // CORREÇÃO DA ROTA AQUI
      setTimeout(() => ionRouter.push('/logincadastro/logincadastro', 'root', 'replace'), 3000);
      
    } catch (error: any) {
      setShowLoading(false);
      const errorMessage = error.message || 'Não foi possível redefinir. O link pode ter expirado.';
      setToast({ show: true, message: errorMessage, color: 'danger' });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Crie sua Nova Senha</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonLoading isOpen={showLoading} message={'Salvando...'} />
        <IonToast
          isOpen={toast.show}
          message={toast.message}
          color={toast.color}
          duration={3000}
          onDidDismiss={() => setToast({ show: false, message: '', color: '' })}
        />

        <form onSubmit={handleSubmit}>
          <IonInput
            label="Email"
            labelPlacement="stacked"
            value={email || ''}
            readonly={true}
          />
          <IonInput
            className="ion-margin-top"
            label="Nova Senha"
            labelPlacement="stacked"
            type="password"
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
            placeholder="Mínimo de 8 caracteres"
            required
            disabled={isSubmitted}
          />
          <IonInput
            className="ion-margin-top"
            label="Confirmar Nova Senha"
            labelPlacement="stacked"
            type="password"
            value={passwordConfirmation}
            onIonChange={e => setPasswordConfirmation(e.detail.value!)}
            required
            disabled={isSubmitted}
          />
          <IonButton className="ion-margin-top" type="submit" expand="block" disabled={showLoading || isSubmitted}>
            Salvar Nova Senha
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default RedefinirSenhaPage;