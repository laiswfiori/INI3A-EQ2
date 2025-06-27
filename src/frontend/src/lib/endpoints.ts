// Arquivo: src/lib/endpoints.ts

import API from './api'; // Importa a classe do arquivo ao lado

const api = new API();

// --- FUNÇÕES EXPORTADAS PARA O APP ---

export const getUserProfile = async () => {
  try {
    const response = await api.get('api/profile');
    return response.user;
  } catch (error) {
    console.error("Erro no endpoint getUserProfile:", error);
    throw error;
  }
};

export const updateUserProfile = async (userData: { name: string, surname: string, email: string, biography: string | null }) => {
  try {
    const response = await api.put('api/profile', userData);
    return response;
  } catch (error) {
    console.error("Erro no endpoint updateUserProfile:", error);
    throw error;
  }
};

export const changeUserPassword = async (passwordData: any) => {
  try {
    const response = await api.put('api/usuario/alterar-senha', passwordData);
    return response;
  } catch (error) {
    console.error("Erro no endpoint changeUserPassword:", error);
    throw error;
  }
};

export const deleteUserAccount = async () => {
  try {
    const response = await api.delete('api/user'); 
    return response;
  } catch (error) {
    console.error("Erro no endpoint deleteUserAccount:", error);
    throw error;
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await api.post('/password/request-reset', { email });
    return response;
  } catch (error) {
    console.error("Erro no endpoint requestPasswordReset:", error);
    throw error;
  }
};

export const resetPassword = async (data: { token: string; email: string; password: string; password_confirmation: string; }) => {
  try {
    const response = await api.post('/password/reset', data);
    return response;
  } catch (error) {
    console.error("Erro no endpoint resetPassword:", error);
    throw error;
  }
};