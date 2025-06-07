import API from './api';


const api = new API();


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
