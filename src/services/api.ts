import axios from 'axios';
import type { Model, QnARequest, QnAResponse, ChatRequest, ChatResponse } from '../types/api';

// API base URL
const API_BASE_URL = 'http://localhost:3000';

// Axios instance oluştur
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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