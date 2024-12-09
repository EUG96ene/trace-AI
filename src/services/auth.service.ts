import { axios } from '@/utils/axios';

const login = (data: any) => {
    return axios.post('/api/v1/auth/login', data)
  };
  const resetPassword = (data: any) => {
    return axios.post('/api/v1/auth/reset-password', data)
  };
  
  const authService = {
    login,
    resetPassword,

  };
  
  export default authService;