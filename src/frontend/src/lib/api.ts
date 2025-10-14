//const prod = false;

export default class API {
  apiUrl: string = "";
  private isRefreshing = false; // Flag para evitar múltiplas tentativas de refresh

  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL;
    //this.apiUrl = prod ? 'API_PROD' : 'http://eq2.ini3a.projetoscti.com.br/backend/public';
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
const text = await response.text();

let responseData;

try {
  responseData = JSON.parse(text);
} catch {
  // tenta achar a posição do primeiro { ou [
  const indexObj = text.indexOf("{");
  const indexArr = text.indexOf("[");

  const indicesValidos = [indexObj, indexArr].filter(i => i !== -1);

  if (indicesValidos.length === 0) {
    // Nenhum JSON encontrado, retorna o texto bruto para não quebrar
    responseData = text;
  } else {
    const inicio = Math.min(...indicesValidos);
    const jsonSubstring = text.substring(inicio);

    try {
      responseData = JSON.parse(jsonSubstring);
    } catch (e) {
      // Se ainda falhar, retorna texto bruto
      responseData = text;
    }
  }
}

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