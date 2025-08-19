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
    
    // DEFINIMOS OS HEADERS E O BODY DE FORMA CONDICIONAL
    const headers: HeadersInit = {};
    let requestBody: any = null;

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