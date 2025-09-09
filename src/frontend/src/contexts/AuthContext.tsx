import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import API from '../lib/api';

// Define a estrutura dos dados do usuário
export interface User {
  id: number;
  name: string;
  email: string;
  surname: string;
  biography: string;
  google_id?: string;
  foto_perfil?: string;
}

// Define o que o contexto irá prover
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
  logout: () => void;
}

// Cria o Contexto com um valor padrão
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cria o Provedor do Contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const api = new API();

  const fetchUser = async () => {
    // Não precisa setar isLoading aqui para evitar piscar a tela no login
    const token = localStorage.getItem('token'); 
    if (token) {
      try {
        // MODIFICADO: Corrigida a rota para a que existe no seu backend
        const userData = await api.get('api/profile'); 
        setUser(userData);
      } catch (error) {
        console.error('Falha ao buscar usuário, token inválido?', error);
        setUser(null);
        localStorage.removeItem('token');
      }
    } else {
      setUser(null);
    }
    setIsLoading(false); // Carregamento inicial termina aqui
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    window.location.href = '/logincadastro/logincadastro';
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    fetchUser,
    updateUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};