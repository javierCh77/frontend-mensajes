import axios from 'axios';

const api = axios.create({
  baseURL: 'http://31.97.23.62:3090/api',
  //baseURL: 'http://localhost:3050/api',
  withCredentials: true,
});



export default api;