const prod = false;

export default class API {
  apiUrl: string = "";
  private isRefreshing = false; // Flag para evitar múltiplas tentativas de refresh

  constructor() {
    this.apiUrl = prod ? 'API_PROD' : 'http://localhost:8000';
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Função para salvar o token. Lembre-se que a resposta do login agora é um objeto.
  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private clearToken(): void {
    localStorage.removeItem('token');
  }

  // Função para deslogar o usuário e redirecionar
  private handleLogout(): void {
    this.clearToken();
    // Use replace para que o usuário não possa voltar para a página anterior no histórico
    window.location.replace('/logincadastro/logincadastro'); 
  }

  // Nova função para tentar renovar o token
  private async refreshToken(): Promise<string> {
    console.log("Tentando renovar o token...");
    try {
      const oldToken = this.getToken();
      if (!oldToken) {
        throw new Error("Nenhum token para renovar.");
      }
      
      const response = await fetch(`${this.apiUrl}/api/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${oldToken}`
        },
      });

      if (!response.ok) {
        throw new Error('Não foi possível renovar o token.');
      }

      const data = await response.json();
      const newToken = data.access_token;
      this.setToken(newToken);
      console.log("Token renovado com sucesso.");
      return newToken;

    } catch (error) {
      console.error("Falha ao renovar o token, deslogando.", error);
      this.handleLogout();
      throw error;
    }
  }

  async makeRequest(method: string, endpoint: string, data: any = null, token: string | null = null, isRetry = false): Promise<any> {
    const authToken = token || this.getToken();
    const url = `${this.apiUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

    // ✅ Verificação atualizada para incluir o endpoint do google
    const isAuthEndpoint = endpoint.includes('login') || endpoint.includes('register') || endpoint.includes('auth/google/callback');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const options: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : null,
    };

    try {
      const response = await fetch(url, options);

      // Lógica de renovação do token
      if (response.status === 401 && !isRetry && !isAuthEndpoint) {
        if (this.isRefreshing) {
            // Se já existe uma tentativa de refresh em andamento, apenas aguarde e tente novamente depois.
            // Para uma implementação mais robusta, seria necessário uma fila de requests.
            // Por enquanto, vamos apenas lançar o erro para evitar loops.
            throw new Error("Refresh de token já em andamento.");
        }

        this.isRefreshing = true;
        try {
            const newToken = await this.refreshToken();
            // Tenta a requisição original novamente com o novo token
            return this.makeRequest(method, endpoint, data, newToken, true);
        } finally {
            this.isRefreshing = false;
        }
      }

      const responseData = await response.json();

      if (!response.ok) {
        const error: any = new Error(`HTTP error! status: ${response.status}`);
        error.response = response;
        error.data = responseData;
        throw error;
      }

      // ✅ Condição atualizada para salvar o token do login com Google também
      if (isAuthEndpoint) {
          if (responseData.access_token) {
              this.setToken(responseData.access_token);
          }
      }

      return responseData;

    } catch (error: any) { // Adicionado 'any' para acessar 'error.response'
      console.error('Erro ao fazer requisição:', error);
      // Se o erro for de token inválido e já for uma nova tentativa, deslogue.
      if (error.response?.status === 401 && isRetry) {
          this.handleLogout();
      }
      throw error;
    }
  }

  async get(endpoint: string, token: string | null = null) {
    return this.makeRequest('GET', endpoint, null, token);
  }

  async post(endpoint: string, data: any, token: string | null = null) {
    return this.makeRequest('POST', endpoint, data, token);
  }

  async put(endpoint: string, data: any, token: string | null = null) {
    return this.makeRequest('PUT', endpoint, data, token);
  }

  async delete(endpoint: string, token: string | null = null) {
    return this.makeRequest('DELETE', endpoint, null, token);
  }
}