import React from 'react';
import { IonPage, IonRow, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import './configuracoes.css';
import Materias from '../../components/Materias';
import MultiSelectDias from '../../components/MultiSelectDias';
import HorasEstudo from '../../components/HorasEstudo';

const Configuracoes: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <div id="body">
        <div className="configuracoes-container">
          <div className="div1">
            <h1><b>Agradecemos por se juntar a nós!</b></h1>
            <h4>Seu cadastro foi efetivado! Você está quase lá!</h4><br />
            <h3><b>Configure seu plano de estudos</b></h3>
            <h4> *Lembre-se de criar um plano que se adeque a sua rotina.*</h4>
            <div>
              <MultiSelectDias />
              <HorasEstudo />
              <Materias />
                <IonButton className="botao">Salvar</IonButton>
            </div>
          </div>
        </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Configuracoes;