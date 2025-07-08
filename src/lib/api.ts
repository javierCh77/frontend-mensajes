import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://10.27.63.11:3050/api',
  withCredentials: true,
});



export default api;