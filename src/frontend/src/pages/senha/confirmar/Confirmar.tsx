import React, { useState } from 'react';
import { IonPage, IonContent, IonRow, IonCol, IonIcon, IonInput, IonButton, IonToast, IonLoading } from '@ionic/react';
import { mail, returnDownBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import  {requestPasswordReset}  from '../../../lib/endpoints'; 
import './css/geral.css';
import './css/ui.css';
import './css/layouts.css';

const Confirmar: React.FC = () => {
  const history = useHistory();

  const [email, setEmail] = useState<string>('');
  const [showLoading, setShowLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean, message: string, color: string }>({ show: false, message: '', color: '' });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setShowLoading(true);

    try {
      const response = await requestPasswordReset(email);
      setShowLoading(false);
      setToast({ show: true, message: response.message || 'Link enviado com sucesso!', color: 'success' });
      setEmail(''); 
    } catch (error: any) {
      setShowLoading(false);
      const errorMessage = error.message || 'Não foi possível enviar o link. Tente novamente.';
      setToast({ show: true, message: errorMessage, color: 'danger' });
    }
  };

  return (
    <IonPage className="paginaSenha">
      <IonContent className="pagS">
        <IonLoading isOpen={showLoading} message={'Enviando...'} />
        <IonToast
          isOpen={toast.show}
          message={toast.message}
          color={toast.color}
          duration={3000}
          onDidDismiss={() => setToast({ show: false, message: '', color: '' })}
        />

        <IonRow className="contVoltar" onClick={() => history.goBack()}>
          <IonIcon icon={returnDownBack} className="email"/>
          <p>Voltar para login</p>
        </IonRow>
        <form onSubmit={handleSubmit}>
          <IonRow className='whs'>
            <IonCol className="centroS configM">
              <h1 className="preto titSenha">Esqueceu sua senha?</h1>
              <p className="pSenha">Insira seu email para receber a mensagem de recuperação de senha.</p>
              <IonRow className="contInputEmail">
                <IonRow className="centroHorizontal">
                  <IonCol size="auto" id="divAzul">
                    <IonIcon icon={mail} className="email"/>
                  </IonCol>
                  <IonCol>
                    <p id="txtS">Você receberá um email em sua conta, contendo um link para a atualização da senha. Ele pode estar no spam.</p>
                  </IonCol>
                </IonRow>
                <IonRow className="larguraS">
                  <IonCol className="larguraS2">
                    <IonInput
                      placeholder="Seu email"
                      className="input btnSenhas"
                      value={email}
                      onIonChange={e => setEmail(e.detail.value!)}
                      required
                      type="email"
                    />
                  </IonCol>
                </IonRow>
              </IonRow>
              <IonButton type="submit" className="btnEnviar" disabled={showLoading}>Enviar</IonButton>
            </IonCol>
            <IonCol id="imgInicio">
            </IonCol>
          </IonRow>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Confirmar;