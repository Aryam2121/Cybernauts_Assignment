import axios from 'axios';
import { User, GraphData, CreateUserDTO, UpdateUserDTO, LinkUsersDTO } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userAPI = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  // Get single user
  getUser: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Create user
  createUser: async (data: CreateUserDTO): Promise<User> => {
    const response = await api.post('/users', data);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, data: UpdateUserDTO): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // Link users (create friendship)
  linkUsers: async (userId: string, data: LinkUsersDTO): Promise<{ user: User; friend: User }> => {
    const response = await api.post(`/users/${userId}/link`, data);
    return response.data;
  },

  // Unlink users (remove friendship)
  unlinkUsers: async (userId: string, data: LinkUsersDTO): Promise<{ user: User; friend: User }> => {
    const response = await api.delete(`/users/${userId}/unlink`, { data });
    return response.data;
  },

  // Get graph data
  getGraphData: async (): Promise<GraphData> => {
    const response = await api.get('/graph');
    return response.data;
  },
};

export default api;
