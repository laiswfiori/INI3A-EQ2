// Arquivo: src/lib/api.ts

const prod = false;

export default class API {
  apiUrl: string = "";

  constructor() {
    this.apiUrl = prod ? 'API_DE_PRODUCAO_AQUI' : 'http://localhost:8000';
  }

  private getToken(token?: string | null): string | null {
    return token || localStorage.getItem('token');
  }

  async makeRequest(method: string, endpoint: string, data: any = null, token: string | null = null) {
    const authToken = this.getToken(token);
    const cleanedEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    const url = `${this.apiUrl}/${cleanedEndpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw { 
          status: response.status, 
          message: errorData?.message || response.statusText,
          errors: errorData?.errors || null
        };
      }

      if (response.status === 204) {
        return { success: true };
      }
      
      return await response.json();

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
    return this.makeRequest('DELETE',endpoint, null, token);
  }
}
