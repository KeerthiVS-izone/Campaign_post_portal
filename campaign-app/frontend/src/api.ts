import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export interface CampaignFormData {
  name: string;
  phone_number: string;
  kalaga_maavatam: string;
  thogudhi: string;
  porupu: string;
}

export interface CampaignPost {
  id: number;
  content: string;
  created_at?: string;
}

export interface SubmitResponse {
  message: string;
  id?: number;
}

export const submitCampaignData = async (data: CampaignFormData): Promise<SubmitResponse> => {
  const response = await api.post<SubmitResponse>('/submit', data);
  return response.data;
};

export const getCampaignPosts = async (): Promise<CampaignPost[]> => {
  const response = await api.get<CampaignPost[]>('/posts');
  return response.data;
};

export const uploadPostsExcel = async (file: File): Promise<SubmitResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<SubmitResponse>('/upload-posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export default api;
