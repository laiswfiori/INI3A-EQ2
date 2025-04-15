import React from 'react';
import { IonPage, IonRow, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import './configuracoes.css';

const Configuracoes: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Configurações</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="configuracoes-container">
          <div className="div1">
            <IonRow><h1>Agradecemos por se juntar a nós!</h1></IonRow>
            <h3>Seu cadastro foi efetivado! Você está quase lá!</h3><br></br>
            <h2>Configurações de seu plano de estudos</h2>
            <h3> Lembre-se de criar um plano que se adeque a sua rotina.</h3>
            <div>
                <h3>Dias para o estudo semanal</h3>
                <h4> + Adicionar dias</h4>
                <h3>Horários de estudo dia X</h3>
                <input type = "text" placeholder="w-h horas"/>
                <h3>Matérias cadastradas</h3>
                <h4> + Adicionar matérias</h4>
                <IonButton expand="full">Salvar</IonButton>
            </div>
          </div>

          <div className="div2">
            <h1>FlashMinder</h1>
            <h3>*Imagem*</h3>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Configuracoes;