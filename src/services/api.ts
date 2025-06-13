import axios from 'axios';

// API base URL ve key
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.VITE_API_KEY || '4b679ab8-8d82-47be-9145-c45b9105fae9';

// Axios instance oluştur
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Her istekte otomatik API key ekler
apiClient.interceptors.request.use(
  (config) => {
    // API key varsa header'a ekle
    if (API_KEY) {
      config.headers['X-API-KEY'] = API_KEY;
    }
    
    // Debug için log
    console.log('🚀 API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      hasApiKey: !!API_KEY,
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Hata handling için
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// Model listesi - Backend'den geliyor mu kontrol edelim
export const getModels = async () => {
  try {
    const response = await apiClient.get('/models');
    return response.data;
  } catch (error) {
    console.error('Model listesi alınamadı:', error);
    // Fallback model listesi
    return [
      { id: 'llama3.2:1b', name: 'Llama 3.2 1B' },
      { id: 'llama3.2:3b', name: 'Llama 3.2 3B' },
    ];
  }
};

// QnA sorusu gönder - GERÇEK FORMAT
export const sendQnAQuestion = async (prompt: string, model: string = 'llama3.2:1b') => {
  try {
    console.log('🟡 QnA Request Data:', { 
      prompt, 
      model,
      payload: {
        model: model,
        stream: false,
        prompt: prompt
      }
    });

    const response = await apiClient.post('/ollama/v1/qna', {
      model: model,
      stream: false,
      prompt: prompt
    });

    console.log('🟢 QnA Response:', {
      status: response.data.status,
      data: response.data.data,
      fullResponse: response.data
    });

    // Backend response format: { "status": true, "data": { "response": "cevap" } }
    if (response.data.status && response.data.data) {
      const result = {
        answer: response.data.data.response,
        model: response.data.data.model,
        timestamp: response.data.data.created_at || new Date().toISOString()
      };
      
      console.log('🟢 QnA Parsed Result:', result);
      return result;
    } else {
      console.error('❌ QnA Invalid response format:', response.data);
      throw new Error('Invalid response format');
    }
  } catch (error: any) {
    console.error('❌ QnA Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    throw error;
  }
};

// Chat mesajı gönder - GERÇEK FORMAT
export const sendChatMessage = async (messages: any[], model: string = 'llama3.2:1b') => {
  try {
    const response = await apiClient.post('/ollama/v1/chat', {
      model: model,
      stream: false,
      messages: messages  // MainApp'ten gelen messages'ı direkt kullan
    });

    // Backend response format: { "status": true, "data": { "message": { "role": "assistant", "content": "cevap" } } }
    if (response.data.status && response.data.data && response.data.data.message) {
      return {
        message: response.data.data.message.content,
        model: response.data.data.model,
        timestamp: response.data.data.created_at || new Date().toISOString()
      };
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Chat mesajı gönderilemedi:', error);
    throw error;
  }
};

// Token eklemek için interceptor (Microsoft Auth için)
export const setAuthToken = (token: string) => {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Token kaldır
export const removeAuthToken = () => {
  delete apiClient.defaults.headers.common['Authorization'];
};

// Mevcut modelleri getir
export const getAvailableModels = async () => {
  const response = await apiClient.get('/ollama/v1/models');
  return response.data;
};

// API health check
export const checkApiHealth = async () => {
  try {
    const response = await apiClient.get('/ollama/v1/health');
    return response.data.status === true;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}; 