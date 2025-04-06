import axios from 'axios';

const API_URL = 'https://rishitech.shop/api';

export const todoApi = {
  getAllTodos: () => axios.get(`${API_URL}/todos`),
  createTodo: (text) => axios.post(`${API_URL}/todos`, { text }),
  updateTodo: (id, data) => axios.patch(`${API_URL}/todos/${id}`, data),
  deleteTodo: (id) => axios.delete(`${API_URL}/todos/${id}`),
}; 