import React from 'react';
import { IonPage, IonRow, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import './configuracoes.css';

const Configuracoes: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <div id="body">
        <div className="configuracoes-container">
          <div className="div1">
            <h1><b>Agradecemos por se juntar a nós!</b></h1>
            <h4>Seu cadastro foi efetivado! Você está quase lá!</h4><br />
            <h3><b>Configurações de seu plano de estudos</b></h3>
            <h4> *Lembre-se de criar um plano que se adeque a sua rotina.*</h4>
            <div>
                <h4><b>Dias para o estudo semanal</b></h4>
                <input type = "text" placeholder="+ Adicionar dias"/>
                <h4><b>Horários de estudo dia X</b></h4>
                <input type = "text" placeholder="w-h horas"/>
                <h4><b>Matérias cadastradas</b></h4>
                <input type = "text" placeholder="+ Adicionar matérias"/><br />
                <IonButton className="botao">Salvar</IonButton>
            </div>
          </div>

          <div className="div2">
          <img src="/imgs/logoCompleta.png" alt="Logo png" />
          </div>
        </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Configuracoes;