import React, { createContext, useContext, ReactNode } from 'react';
import useSound from 'use-sound';

import somIniciar from '../assets/sounds/iniciar.mp3'; 
import somConcluir from '../assets/sounds/concluir.mp3';
import somRespCerta from '../assets/sounds/respostaCerta.mp3';
import somRespErrada from '../assets/sounds/respostaErrada.mp3'; 
import somNotificacao from '../assets/sounds/notificacao.mp3'; 

type SoundContextType = {
  playSomIniciar: () => void;
  playSomConcluir: () => void;
  playSomRespCerta: () => void;
  playSomRespErrada: () => void;
  playSomNotificacao: () => void;
};

const SoundContext = createContext<SoundContextType | null>(null);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [playSomIniciar] = useSound(somIniciar);
  const [playSomConcluir] = useSound(somConcluir);
  const [playSomRespCerta] = useSound(somRespCerta);
  const [playSomRespErrada] = useSound(somRespErrada);
  const [playSomNotificacao] = useSound(somNotificacao);

  const value = {
    playSomIniciar,
    playSomConcluir,
    playSomRespCerta,
    playSomRespErrada,
    playSomNotificacao,
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
