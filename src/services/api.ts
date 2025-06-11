import axios from 'axios';
import type { Model, QnARequest, QnAResponse, ChatRequest, ChatResponse } from '../types/api';

// API base URL ve key
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.VITE_API_KEY;

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
      config.headers['X-API-Key'] = API_KEY;
    }
    
    // Debug için log
    console.log('🚀 API Request:', {
      url: config.url,
      method: config.method,
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
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

// Model listesini getir
export const getModels = async (): Promise<Model[]> => {
  try {
    const response = await apiClient.get<Model[]>('/models');
    return response.data;
  } catch (error) {
    console.error('Model listesi alınamadı:', error);
    throw error;
  }
};

// QnA sorusu gönder
export const sendQnAQuestion = async (request: QnARequest): Promise<QnAResponse> => {
  try {
    const response = await apiClient.post<QnAResponse>('/qna', request);
    return response.data;
  } catch (error) {
    console.error('QnA sorusu gönderilemedi:', error);
    throw error;
  }
};

// Chat mesajı gönder
export const sendChatMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  try {
    const response = await apiClient.post<ChatResponse>('/chat', request);
    return response.data;
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