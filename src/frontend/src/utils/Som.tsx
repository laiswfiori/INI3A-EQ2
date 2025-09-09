import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import useSound from 'use-sound';

import somIniciar from '../assets/sounds/iniciar.mp3'; 
import somConcluir from '../assets/sounds/concluir.mp3';
import somRespCerta from '../assets/sounds/respostaCerta.mp3';
import somRespErrada from '../assets/sounds/respostaErrada.mp3'; 
import somNotificacao from '../assets/sounds/notificacao.mp3'; 
import somPaginas from '../assets/sounds/paginas.mp3';
import somLareira from '../assets/sounds/lareira.mp3';

type SoundContextType = {
  playSomIniciar: () => void;
  playSomConcluir: () => void;
  playSomRespCerta: () => void;
  playSomRespErrada: () => void;
  playSomNotificacao: () => void;
  playSomPaginas: () => void;
  playSomLareira: () => void;
  stopSomPaginas: () => void; 
  stopSomLareira: () => void;
  somAtivo: boolean;
  toggleSom: () => void;
};

const SoundContext = createContext<SoundContextType | null>(null);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [somAtivo, setSomAtivo] = useState<boolean>(() => {
    const salvo = localStorage.getItem('somAtivo');
    return salvo !== 'false';
  });

  const [playIniciar] = useSound(somIniciar);
  const [playConcluir] = useSound(somConcluir);
  const [playRespCerta] = useSound(somRespCerta);
  const [playRespErrada] = useSound(somRespErrada);
  const [playNotificacao] = useSound(somNotificacao);
  const [playPaginas, { stop: stopPaginas }] = useSound(somPaginas);
  const [playLareira, { stop: stopLareira }] = useSound(somLareira);

  useEffect(() => {
    localStorage.setItem('somAtivo', somAtivo.toString());
  }, [somAtivo]);

  const playSomIniciar = () => { if (somAtivo) playIniciar(); };
  const playSomConcluir = () => { if (somAtivo) playConcluir(); };
  const playSomRespCerta = () => { if (somAtivo) playRespCerta(); };
  const playSomRespErrada = () => { if (somAtivo) playRespErrada(); };
  const playSomNotificacao = () => { if (somAtivo) playNotificacao(); };
  const playSomPaginas = () => { if (somAtivo) playPaginas(); };
  const playSomLareira = () => { if (somAtivo) playLareira(); };

  const stopSomPaginas = () => stopPaginas();
  const stopSomLareira = () => stopLareira();

  const toggleSom = () => setSomAtivo(prev => !prev);

  const value = {
    playSomIniciar,
    playSomConcluir,
    playSomRespCerta,
    playSomRespErrada,
    playSomNotificacao,
    playSomPaginas,
    playSomLareira,
    somAtivo,
    toggleSom,
    stopSomPaginas,
    stopSomLareira,
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSoundPlayer = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSoundPlayer deve ser usado dentro de SoundProvider');
  }
  return context;
};
