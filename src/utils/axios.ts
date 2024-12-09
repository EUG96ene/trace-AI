import HttpClient from 'axios';
import { signOut } from 'next-auth/react';

const baseURL = process.env.API_BASE_URL as string;

const axios = HttpClient.create({
  baseURL,
  withCredentials: true,
});

async function axiosClient(auth_token) {
  if (auth_token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${auth_token}`;
  }

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const statusCode = error && error.response ? error.response.status : 0;
      if (statusCode === 401 && typeof window !== 'undefined') {
        signOut();
        window.location.href = '/portal/auth';
      }
      return Promise.reject(error);
    },
  );

  return axios;
}

export { axios, axiosClient };
