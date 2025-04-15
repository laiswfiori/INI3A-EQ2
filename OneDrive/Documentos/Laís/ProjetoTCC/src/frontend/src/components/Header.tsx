import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonHeader, IonToolbar, IonImg, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { calendar, star, documentText, personCircle, menu, close } from 'ionicons/icons';
import './css/ui.css';
import './css/geral.css';
import './css/layouts.css';

const Header: React.FC = () => {
  const history = useHistory();
  const [menuAberto, setMenuAberto] = useState(false);

  const navAgenda = () => {
    history.push('/topicos/conteudos');
  }
  const navFlashcards = () => {
    history.push('/topicos/conteudos');
  }
  const navConteudos = () => {
    history.push('/topicos/conteudos');
  }
  const navPerfil = () => {
    history.push('/registro/registro');
  }

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  return (
    <IonHeader>
      <IonToolbar>
        <div id="header" className="azul">
          <IonImg src="/imgs/logo1.png" alt="Logo FSMR" id="logo"/>

          <div id="nav" className="azul">
              <div>
                <IonTabButton className="azul" tab="agenda" onClick={navAgenda}>
                  <IonIcon icon={calendar} className="icones"/>
                  <IonLabel className="iconesTxt">Agenda</IonLabel>
                </IonTabButton>
              </div>
              <div>
                <IonTabButton className="azul" tab="flashcards" onClick={navFlashcards}>
                  <IonIcon icon={star} className="icones"/>
                  <IonLabel className="iconesTxt">Flashcards</IonLabel>
                </IonTabButton>
              </div>
              <div>
                <IonTabButton className="azul" tab="conteudos" onClick={navConteudos}>
                    <IonIcon icon={documentText} className="icones"/>
                    <IonLabel className="iconesTxt">Conteúdos</IonLabel>
                  </IonTabButton>
              </div>
          </div>

          <div id="perfil" className="azul">
            <IonTabButton tab="perfil" onClick={navPerfil}>
                  <IonIcon icon={personCircle} className="icones"/>
                  <IonLabel className="iconesTxt">Perfil</IonLabel>
            </IonTabButton>
          </div>     

        </div>

        <div id="headerMobile" className="azul">
          <IonImg src="/imgs/logo1.png" alt="Logo FSMR" id="logoMobile"/>

          <div id="menu" className="azul">
              <div>
                <div className="azul" onClick={toggleMenu}>
                  <IonIcon icon={menuAberto ? close : menu} className="iconesMobile" id="iconeMenu"/>
                </div>
              </div>
          </div>
        </div>
        <div id="mobileMenu" className="azul">
          {menuAberto && (
                <div id="linksMenu">
                  <div>
                    <IonTabButton className="azul" tab="agenda" onClick={navAgenda}>
                      <IonIcon icon={calendar} className="iconesMobile" />
                      <IonLabel className="iconesTxt">Agenda</IonLabel>
                    </IonTabButton>
                  </div>
                  <div>
                    <IonTabButton className="azul" tab="flashcards" onClick={navFlashcards}>
                      <IonIcon icon={star} className="iconesMobile" />
                      <IonLabel className="iconesTxt">Flashcards</IonLabel>
                    </IonTabButton>
                  </div>
                  <div>
                    <IonTabButton className="azul" tab="conteudos" onClick={navConteudos}>
                      <IonIcon icon={documentText} className="iconesMobile" />
                      <IonLabel className="iconesTxt">Conteúdos</IonLabel>
                    </IonTabButton>
                  </div>
                  <div>
                    <IonTabButton className="azul" tab="perfil" onClick={navPerfil}>
                          <IonIcon icon={personCircle} className="iconesMobile"/>
                          <IonLabel className="iconesTxt">Perfil</IonLabel>
                    </IonTabButton>
                  </div>   
                </div>
            )}
        </div>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
