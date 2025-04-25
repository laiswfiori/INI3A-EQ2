// Api.js

//Variável de controle
const prod = false;

export default class API {
    apiUrl:string = "";

    constructor(){
        this.apiUrl = prod ? 'API_PROD' : 'http://10.153.0.107:8000' ; // URL base da sua API
    }
    
    async makeRequest(method:string, endpoint:string, data = null, token = null) {
      const url = `${this.apiUrl}/${endpoint}`;
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: data ? JSON.stringify(data) : null,
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result;
      } catch (error) {
        console.error('Erro ao fazer requisição:', error);
        throw error;
      }
    }
    async makeRequestPure(method:string, endpoint:string, data = null, token = null) {
      const url = `${this.apiUrl}/${endpoint}`;
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: data ? JSON.stringify(data) : null,
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result;
      } catch (error) {
        console.error('Erro ao fazer requisição:', error);
        throw error;
      }
    }

    async makeUnsplashRequest(query:string) {

      const method = 'GET';
      const endpoint = `https://api.unsplash.com/search/photos?query=${query}`;
      const accessKey = 'SXW2jdYh2hAuEnmOQ7PnD6mp6KPEvxFuZMelO4xa20Q';
      const options = {
        method,
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
        body: null,
      }

      try {
        const response = await fetch(endpoint, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result;
      } catch (error) {
        console.error('Erro ao fazer requisição:', error);
        throw error;
      }
    }

    async getPure(url:string, token = null) {
      return this.makeRequestPure('GET', url, null, token);
    }

    async unsplashGet(query:string) {
      return this.makeUnsplashRequest(query);
    }

    async get(endpoint:string, token = null) {
      return this.makeRequest('GET', endpoint, null, token);
    }

    async post(endpoint:string, data:any, token = null) {
      return this.makeRequest('POST', endpoint, data, token);
    }

    async put(endpoint:string, data:any, token = null) {
      return this.makeRequest('PUT', endpoint, data, token);
    }

    async delete(endpoint:string, token = null) {
      return this.makeRequest('DELETE', endpoint, null, token);
    }
};