import API from './api';

const api = new API();

// --- FUNÇÕES DE AUTENTICAÇÃO E PERFIL ---

export const registerUser = async (userData: any) => {
    try {
        const response = await api.post('api/register', userData);
        return response;
    } catch (error) {
        console.error("Erro no endpoint registerUser:", error);
        throw error;
    }
};

export const loginUser = async (credentials: any) => {
    try {
        const response = await api.post('api/login', credentials);
        return response;
    } catch (error) {
        console.error("Erro no endpoint loginUser:", error);
        throw error;
    }
};

export const getUserProfile = async () => {
  try {
    const data = await api.get('api/profile');
    return data.user; 
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


export const getMaterias = async () => {
    try {
        const response = await api.get('materias');
        return response;
    } catch (error) {
        console.error("Erro no endpoint getMaterias:", error);
        throw error;
    }
};

export const getAgendaConfiguracoes = async () => {
  const api = new API();
  const token = localStorage.getItem('token');
  return api.get('/agendaConfiguracao', token); 
};

export const saveAgendaConfiguracoes = async (data: any) => {
  try {
    const response = await api.post('/agendaConfiguracao', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao salvar agendaConfiguracao:', error);
    throw error;
  }
};