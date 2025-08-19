import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getUserProfile } from '../lib/endpoints';

interface UserProfile {
  id: number;
  name: string;
  surname: string;
  email: string;
  biography: string | null;
  profile_image_url: string | null;
}

// Define o tipo do contexto
interface UserProfileContextType {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isLoadingProfile: boolean;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

// Cria o provedor que irá envolver a sua aplicação
export const UserProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 0,
    name: '',
    surname: '',
    email: '',
    biography: null,
    profile_image_url: null,
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchInitialProfile = async () => {
      const token = localStorage.getItem('token');

      // SE NÃO HOUVER TOKEN, NÃO FAÇA NADA.
      // Apenas termine o carregamento, o usuário está deslogado.
      if (!token) {
        setIsLoadingProfile(false);
        return;
      }
      try {
        const profileData = await getUserProfile();

        console.log('DETETIVE 1: DADOS RECEBIDOS PELA API:', profileData);

        // Adiciona uma verificação de segurança
        if (profileData && profileData.id) { 
            setUserProfile(profileData);
        } else {
          localStorage.removeItem('token');
        }
      }catch (error) {
        console.error("Erro ao carregar perfil inicial:", error);
      }finally {
        setIsLoadingProfile(false);
      }
    };

    fetchInitialProfile();
  }, []);

  return (
    <UserProfileContext.Provider value={{ userProfile, setUserProfile, isLoadingProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

// Cria um hook customizado para facilitar o uso do contexto
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};