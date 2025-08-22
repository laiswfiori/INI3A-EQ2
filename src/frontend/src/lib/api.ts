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

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private clearToken(): void {
    localStorage.removeItem('token');
  }

  private handleLogout(): void {
    this.clearToken();
    window.location.replace('/logincadastro/logincadastro'); 
  }

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
    // DEFINIMOS OS HEADERS E O BODY DE FORMA CONDICIONAL
    const headers: HeadersInit = {};
    let requestBody: any = null;
    const isAuthEndpoint = endpoint.includes('login') || endpoint.includes('register') || endpoint.includes('auth/google/callback');

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    if (data instanceof FormData) {
        // Se for FormData, não definimos o Content-Type manualmente.
        // O navegador irá definir automaticamente para 'multipart/form-data'.
        // Passamos o FormData diretamente para o body.
        requestBody = data;
    } else if (data !== null) {
        // Se NÃO for FormData, assumimos que é JSON.
        // Definimos o Content-Type para 'application/json'.
        // Convertemos o objeto para string JSON.
        headers['Content-Type'] = 'application/json';
        requestBody = JSON.stringify(data);
    }

    const options: RequestInit = {
        method,
        headers,
        body: requestBody,
    };

    try {
      const response = await fetch(url, options);

      if (response.status === 401 && !isRetry && !isAuthEndpoint) {
        if (this.isRefreshing) {
          throw new Error("Refresh de token já em andamento.");
        }

        this.isRefreshing = true;
        try {
          const newToken = await this.refreshToken();
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

      if (isAuthEndpoint) {
        if (responseData.access_token) {
          this.setToken(responseData.access_token);
        }
      }

      return responseData;

    } catch (error: any) {
      console.error('Erro ao fazer requisição:', error);
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