import React, { useRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, IonContent, IonButton, IonText, IonIcon } from '@ionic/react';
import './css/geral.css';
import './css/ui.css';
import './css/layouts.css';
import './css/darkmode.css';
import { arrowBack, refresh } from 'ionicons/icons';
import ThemeManager from '../../utils/ThemeManager';
import '../../utils/css/variaveisCores.css';
import { useSoundPlayer } from '../../utils/Som';

const POMODORO_TIME = 25 * 60;

const Estudo: React.FC = () => {
    const theme = localStorage.getItem('theme');
    document.documentElement.classList.add(theme === 'dark' ? 'dark' : 'light');
    const history = useHistory();
    const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isRunning && timeLeft > 0) {
        timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        } else if (timeLeft === 0) {
        setIsRunning(false);
        }
        return () => clearInterval(timer);
    }, [isRunning, timeLeft]);

    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60).toString().padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    };

    const handleStartPause = () => setIsRunning(!isRunning);
    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(POMODORO_TIME);
    };

    const { playSomPaginas, playSomLareira, somAtivo, stopSomPaginas, stopSomLareira } = useSoundPlayer();

    const estudoRef = useRef({ intervalPag: 0, intervalLareira: 0 });

    useEffect(() => {
      if (somAtivo) {
          playSomPaginas();
          estudoRef.current.intervalPag = window.setInterval(() => {
              playSomPaginas();
          }, 10000); 
  
          playSomLareira();
          estudoRef.current.intervalLareira = window.setInterval(() => {
              playSomLareira();
          }, 15000); 
      }
  
      return () => {
          clearInterval(estudoRef.current.intervalPag);
          clearInterval(estudoRef.current.intervalLareira);
          stopSomPaginas();
          stopSomLareira();
      };
  }, [somAtivo, playSomPaginas, playSomLareira, stopSomPaginas, stopSomLareira]);

  return (
    <>
    <ThemeManager />
    <IonPage>
      <IonContent fullscreen className={`bodyE ${theme === 'dark' ? 'dark' : 'light'}`}>
        <div className="timer-container">
          <IonText className="timer-display pDarkmode">{formatTime(timeLeft)}</IonText>
          <div className="botoes">
            <IonButton expand="block" color="medium" className="btnEstudo" onClick={() => history.goBack()}>
               <IonIcon icon={arrowBack} className="iconeReiniciar" />
            </IonButton>
            <IonButton expand="block" onClick={handleStartPause} className="btnIniciarPausar">
              {isRunning ? 'Pausar' : 'Iniciar'}
            </IonButton>
            <IonButton expand="block" onClick={handleReset} color="medium" className="btnEstudo">
               <IonIcon icon={refresh} className="iconeReiniciar" />
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
    </>
  );
};

export default Estudo;
