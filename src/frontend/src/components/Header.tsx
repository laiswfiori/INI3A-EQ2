import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonHeader, IonToolbar, IonImg, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { home, calendar, star, documentText, personCircle } from 'ionicons/icons';
import './css/ui.css';
import './css/geral.css';
import './css/layouts.css';

const Header: React.FC = () => {
  const history = useHistory();
  const [menuAberto, setMenuAberto] = useState(false);

  const navHome = () => {
    history.push('/pagInicial/home');
  }
  const navAgenda = () => {
    history.push('/agenda/agenda');
  }
  const navFlashcards = () => {
    history.push('/flashcards/flashcards');
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
          <div id="logoHome">
            <IonImg src="/imgs/logoInicio.png" alt="Logo FSMR" id="logo" onClick={navHome}/>
          </div>

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

          <button
            className={`menu ${menuAberto ? 'opened' : ''}`}
            onClick={toggleMenu}
            aria-label="Main Menu"
            aria-expanded={menuAberto}
          >
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              <path className="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
              <path className="line line2" d="M 20,50 H 80" />
              <path className="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
            </svg>
          </button>

          
        </div>
        {menuAberto && (
          <div id="mobileMenu" className="azul">
            <div id="linksMenu">
                <div className="menu2" tab="agenda" onClick={navAgenda}>
                  <IonIcon icon={calendar} className="iconesMobile" />
                  <IonLabel className="iconesTxt">Agenda</IonLabel>
                </div>
                <div className="menu2" tab="flashcards" onClick={navFlashcards}>
                  <IonIcon icon={star} className="iconesMobile" />
                  <IonLabel className="iconesTxt">Flashcards</IonLabel>
                </div>
                <div className="menu2" tab="conteudos" onClick={navConteudos}>
                  <IonIcon icon={documentText} className="iconesMobile" />
                  <IonLabel className="iconesTxt">Conteúdos</IonLabel>
                </div>
                <div className="menu2" tab="perfil" onClick={navPerfil}>
                  <IonIcon icon={personCircle} className="iconesMobile" />
                  <IonLabel className="iconesTxt">Perfil</IonLabel>
                </div>
            </div>
          </div>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
