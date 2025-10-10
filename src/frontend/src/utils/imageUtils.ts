// Constante para a URL base da API
const API_BASE_URL = 'http://eq2.ini3a.projetoscti.com.br';

/**
 * Constrói a URL completa para uma imagem de perfil
 * @param fotoPerfil - Caminho relativo da foto de perfil (ex: "fotos_perfil/user_19_1760093060.png")
 * @returns URL completa da imagem ou null se não houver foto
 */
export const getProfileImageUrl = (fotoPerfil?: string | null): string | null => {
  if (!fotoPerfil) {
    return null;
  }
  
  return `${API_BASE_URL}/backend/public/storage/${fotoPerfil}`;
};

/**
 * Constrói a URL completa para qualquer imagem armazenada no storage público
 * @param imagePath - Caminho relativo da imagem
 * @returns URL completa da imagem
 */
export const getStorageImageUrl = (imagePath: string): string => {
  return `${API_BASE_URL}/backend/public/storage/${imagePath}`;
};

