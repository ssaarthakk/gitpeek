import axios from 'axios';
import { signOut } from 'next-auth/react';

const api = axios.create();

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      signOut({ callbackUrl: '/' }); 
    }
    return Promise.reject(error);
  }
);

export default api;