import React from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, IonContent, IonButton, IonImg } from '@ionic/react';
import './css/ui.css';
import './css/layout.css';
import './css/geral.css';
import Materias from '../../components/Materias';
import MultiSelectDias from '../../components/MultiSelectDias';
import HorasEstudo from '../../components/HorasEstudo';

const Configuracoes: React.FC = () => {
  const history = useHistory();

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };
  
  const navHome = () => {
      history.push('/pagInicial/home');
  };

  const navPerfil = () => {
    if (isAuthenticated()) {
      history.push('/perfil/perfil');
    } else {
      history.push('/logincadastro/logincadastro');
    }
  };

  return (
    <IonPage>
      <IonContent>
        <div id="body">
         <div className="bubble-background">
            <div className="bubble bubble1"></div>
            <div className="bubble bubble2"></div>
            <div className="bubble bubble3"></div>
            <div className="bubble bubble4"></div>
            <div className="bubble bubble5"></div>
          </div>
        <div className="configuracoes-container">
          <div className="div111">
            <div className='scroll'>
                  <div className='grid1'>
                    <div className="voltarHome">
                      <h4 className="h444" onClick={navHome}>🠔Home</h4>
                    <IonImg className="img" src="/imgs/logoSemFundo.png" alt="Ir para pagInicial" onClick={navHome}/>
                  </div>
                  <div className="avisos">
                    <h4 className="h333 h41"><b>Seu cadastro foi efetivado. Você está quase lá!</b></h4>
                  </div>
                </div>
                <h3 className="h111"><b className="h111">Configure seu plano de estudos</b></h3>
                <h4 className="h444 h41"> *Lembre-se de criar um plano que se adeque a sua rotina.*</h4>
                <div>
                  <MultiSelectDias />
                  <HorasEstudo />
                  <Materias />
                    <IonButton className="botao">Salvar</IonButton>
                    <IonButton className="botao" onClick={navHome}>Configurar mais tarde</IonButton>
                </div>
            </div>
          </div>
        </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Configuracoes;