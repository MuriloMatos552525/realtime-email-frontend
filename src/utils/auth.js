// utils/auth.js
import api from './api';

export const loginUser = async (username, password) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  const response = await api.post('/token', params);
  return response.data;
};

export const registerUser = async (username, password) => {
  await api.post('/users/', { username, password });
  const response = await loginUser(username, password);
  return response;
};
