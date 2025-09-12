import React, { useState, useRef, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { IonHeader, IonToolbar, IonImg, IonTabButton, IonIcon, IonLabel, IonPopover, IonContent, IonButton, IonRow, IonAvatar } from '@ionic/react';
import { home, calendar, star, documentText, personCircle, notifications, close, alarm } from 'ionicons/icons';
import './css/ui.css';
import './css/geral.css';
import './css/layouts.css';
import './css/darkmode.css';
import ThemeManager from '../utils/ThemeManager';
import '../utils/css/variaveisCores.css';
import { useSoundPlayer } from './../utils/Som';
import { useAuth } from '../contexts/AuthContext'; // 1. ADICIONADO: Importa o hook de autenticação

const Header: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const [mostrarPopover, setMostrarPopover] = useState(false);

  const { user } = useAuth(); // 3. ADICIONADO: Pega o usuário do estado global

  const savedTheme = localStorage.getItem('theme');
  const logoSrc = savedTheme === 'dark' ? '/imgs/logoInicioDarkmode.png' : '/imgs/logoInicio.png';
  const logoMobileSrc = savedTheme === 'dark' ? '/imgs/logoMobileDarkmode.png' : '/imgs/logoMobile.png';

  const { playSomNotificacao } = useSoundPlayer();

  // 4. MODIFICADO: A função isAuthenticated foi removida. Usaremos o 'user' do useAuth.
  const navHome = () => {
    history.replace('/pagInicial/home');
  };

  const navAgenda = () => {
    if (user) { // MODIFICADO
      history.replace('/agenda/agenda');
    } else {
      history.replace('/logincadastro/logincadastro');
    }
  };

  const navFlashcards = () => {
    if (user) { // MODIFICADO
      history.replace('/flashcards/telainicialflashcards');
    } else {
      history.replace('/logincadastro/logincadastro');
    }
  };

  const navEstudo = () => {
    if (user) { // MODIFICADO
      history.replace('/estudo/estudo');
    } else {
      history.replace('/logincadastro/logincadastro');
    }
  };

  const navConteudos = () => {
    if (user) { // MODIFICADO
      history.replace('/conteudos/materias');
    } else {
      history.replace('/logincadastro/logincadastro');
    }
  };

  const navPerfil = () => {
    if (user) { // MODIFICADO
      history.replace('/perfil/perfil');
    } else {
      history.replace('/logincadastro/logincadastro');
    }
  };

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const rotaMateriasAtiva =
    location.pathname.includes('/conteudos') ||
    location.pathname.startsWith('/materias/') ||
    location.pathname.startsWith('/topicos/') ||
    location.pathname.startsWith('/atividades/');

  const rotaFlashcardsAtiva =
    location.pathname.includes('/flashcards') ||
    location.pathname.startsWith('/flashcard/');

  useEffect(() => {
    const checkPopover = () => {
      const notificacoesAtivas = localStorage.getItem('notificacoesAtivas') !== 'false';
      if (!notificacoesAtivas) {
        setMostrarPopover(false);
        return;
      }

      const ultimo = localStorage.getItem('ultimaExibicaoPopover');
      const agora = Date.now();

      if (!ultimo || (agora - parseInt(ultimo)) > 3 * 60 * 60 * 1000) {
        setMostrarPopover(true);
        playSomNotificacao();
        localStorage.setItem('ultimaExibicaoPopover', agora.toString());
      }
    };

    checkPopover();
    const interval = setInterval(checkPopover, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ThemeManager />
      <IonHeader>
        <IonToolbar>
          <div id="header" className="azul">
            <div id="logoHome">
              <IonImg src={logoSrc} alt="Logo FSMR" id="logo" onClick={navHome} />
            </div>

            <div id="nav" className="azul" ref={navRef}>
              <div>
                <IonTabButton className="azul" tab="agenda" onClick={navAgenda}>
                  <IonIcon icon={calendar} className={`icones ${location.pathname.startsWith('/agenda') ? 'ativo' : ''}`} />
                  <IonLabel className={`iconesTxt ${location.pathname.startsWith('/agenda') ? 'ativo' : ''}`}>Agenda</IonLabel>
                </IonTabButton>
              </div>

              <div>
                <IonTabButton className="azul" tab="flashcards" onClick={navFlashcards}>
                  <IonIcon icon={star} className={`icones ${rotaFlashcardsAtiva ? 'ativo' : ''}`} />
                  <IonLabel className={`iconesTxt ${rotaFlashcardsAtiva ? 'ativo' : ''}`}>Flashcards</IonLabel>
                </IonTabButton>
              </div>

              <div>
                <IonTabButton className="azul" tab="estudo" onClick={navEstudo}>
                  <IonIcon icon={alarm} className={`icones ${location.pathname.startsWith('/estudo') ? 'ativo' : ''}`} />
                  <IonLabel className={`iconesTxt ${location.pathname.startsWith('/estudo') ? 'ativo' : ''}`}>Sala de estudo</IonLabel>
                </IonTabButton>
              </div>

              <div>
                <IonTabButton className="azul" tab="conteudos" onClick={navConteudos}>
                  <IonIcon icon={documentText} className={`icones ${rotaMateriasAtiva ? 'ativo' : ''}`} />
                  <IonLabel className={`iconesTxt ${rotaMateriasAtiva ? 'ativo' : ''}`}>Matérias</IonLabel>
                </IonTabButton>
              </div>
            </div>

            <div>
              <IonTabButton className="azul" tab="perfil" onClick={navPerfil}>
                <IonAvatar className={`avatar-header icones ${location.pathname.startsWith('/perfil') ? 'ativo' : ''}`}>
                  <img src={user?.foto_perfil || personCircle} alt="Perfil" className={`icones ${location.pathname.startsWith('/perfil') ? 'ativo' : ''}`} />
                </IonAvatar>
                <IonLabel className={`iconesTxt ${location.pathname.startsWith('/perfil') ? 'ativo' : ''}`}>Perfil</IonLabel>
              </IonTabButton>
            </div>
          </div>
          
          <IonButton
            id="popover-trigger"
            ref={(el) => {
              if (el && navRef.current) {
                const navRect = navRef.current.getBoundingClientRect();
                el.style.position = 'fixed';
                el.style.top = `${navRect.bottom + 5}px`;
                el.style.right = '20px';
                el.style.display = 'none';
              }
            }}
          ></IonButton>

          <IonPopover
            isOpen={mostrarPopover}
            onDidDismiss={() => setMostrarPopover(false)}
            trigger="popover-trigger"
            side="bottom"
            alignment="end"
            className="popoverPosicao"
          >
            <IonContent className="ion-padding" >
              <div className="grid-popover-container">
                <div className="popover-col1">
                  <div className="contIP" id="contIP">
                    <IonIcon icon={notifications} className="iconesPopover" />
                  </div>
                </div>
                <div className="popover-col2">
                  <IonRow>
                    <p>Hora de revisar!</p>
                  </IonRow>
                  <IonRow>
                    <p>Lembre-se de sempre revisar seus flashcards.</p>
                  </IonRow>
                </div>
                <div className="popover-col1">
                  <div className="contIP">
                    <IonIcon icon={close} className="iconesPopover" onClick={() => setMostrarPopover(false)}
                      style={{ cursor: 'pointer' }} />
                  </div>
                </div>
              </div>
            </IonContent>
          </IonPopover>

          <div id="headerMobile" className="azul">
            <IonImg src={logoMobileSrc} alt="Logo FSMR" id="logoMobile" onClick={navHome} />

            <button
              className={`menu-line ${menuAberto ? 'opened' : ''}`}
              onClick={toggleMenu}
              aria-label="Main Menu"
              aria-expanded={menuAberto}
            >
              <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                <path className="menu-line menu-line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                <path className="menu-line menu-line2" d="M 20,50 H 80" />
                <path className="menu-line menu-line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
              </svg>
            </button>
          </div>
          {menuAberto && (
            <div id="mobileMenu" className="azul" ref={navRef}>
              <div id="linksMenu">
                <div className="menu2" onClick={navAgenda}>
                  <IonIcon icon={calendar} className={`iconesMobile ${location.pathname.startsWith('/agenda') ? 'ativo' : ''}`} />
                  <IonLabel className={`iconesTxt ${location.pathname.startsWith('/agenda') ? 'ativo' : ''}`}>Agenda</IonLabel>
                </div>
                <div className="menu2" onClick={navFlashcards}>
                  <IonIcon icon={star} className={`iconesMobile ${rotaFlashcardsAtiva ? 'ativo' : ''}`} />
                  <IonLabel className={`iconesTxt ${rotaFlashcardsAtiva ? 'ativo' : ''}`}>Flashcards</IonLabel>
                </div>
                <div className="menu2" onClick={navEstudo}>
                  <IonIcon icon={alarm} className={`iconesMobile ${location.pathname.startsWith('/estudo') ? 'ativo' : ''}`} />
                  <IonLabel className={`iconesTxt ${location.pathname.startsWith('/estudo') ? 'ativo' : ''}`}>Sala de estudo</IonLabel>
                </div>
                <div className="menu2" onClick={navConteudos}>
                  <IonIcon icon={documentText} className={`iconesMobile ${rotaMateriasAtiva ? 'ativo' : ''}`} />
                  <IonLabel className={`iconesTxt ${rotaMateriasAtiva ? 'ativo' : ''}`}>Conteúdos</IonLabel>
                </div>
                <div className="menu2" onClick={navPerfil}>
                  <IonAvatar className="avatar-header-mobile">
                     <img src={user?.foto_perfil || personCircle} alt="Perfil" />
                  </IonAvatar>
                  <IonLabel className={`iconesTxt ${location.pathname.startsWith('/perfil') ? 'ativo' : ''}`}>Perfil</IonLabel>
                </div>
              </div>
            </div>
          )}
        </IonToolbar>
      </IonHeader>
    </>
  );
};

export default Header;

