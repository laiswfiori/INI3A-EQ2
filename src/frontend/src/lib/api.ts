const prod = false;

export default class API {
  apiUrl: string = "";

  constructor() {
    this.apiUrl = prod ? 'API_PROD' : 'http://localhost:8000';
  }

  private getToken(token?: string | null): string | null {
    return token || localStorage.getItem('token');
  }

  async makeRequest(method: string, endpoint: string, data: any = null, token: string | null = null) {
    const authToken = this.getToken(token);
    const url = `${this.apiUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
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

      if (response.status === 401) {
        localStorage.removeItem('token'); // Limpa o token ruim
        window.location.href = '/logincadastro/logincadastro'; // Força o redirecionamento
        throw new Error("Sessão inválida. Redirecionando para o login...");
      }

      const responseData = await response.json();

      if (!response.ok) {
        const error: any = new Error(`HTTP error! status: ${response.status}`);
        error.response = response;
        error.data = responseData;
        throw error;
      }

      return responseData;
      
    } catch (error) {
      console.error('Erro ao fazer requisição:', error);
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