import axios from 'axios';

const API = axios.create({
  baseURL: 'https://tweetapi.risingsuntech.in/api',
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (username: string, password: string) =>
  API.post('/auth/register', { username, password });

export const login = (username: string, password: string) =>
  API.post('/auth/login', { username, password });

export const getMe = () => API.get('/auth/me');

// User Details
export const submitDetails = (data: {
  name: string; phone_number: string; district: string;
  constituency: string; responsibility: string;
}) => API.post('/users/details', data);

export const getMyDetails = () => API.get('/users/details');

// Posts
export const getPosts = () => API.get('/posts/');
export const createPost = (content: string) => API.post('/posts/', { content });
export const deletePost = (id: number) => API.delete(`/posts/${id}`);

// Retweets
export const getRetweets = () => API.get('/posts/retweets');
export const createRetweet = (content: string) => API.post('/posts/retweets', { content });
export const deleteRetweet = (id: number) => API.delete(`/posts/retweets/${id}`);

// Uploaded Posts
export const getUploadedPosts = () => API.get('/posts/uploaded');
export const uploadExcel = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return API.post('/posts/upload-excel', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default API;
