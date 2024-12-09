import { axios } from '@/utils/axios'; 
import to from 'await-to-js';

const endpointURL = `/providers`
const createProvider = async (data: any) => {
  return to(axios.post(`${endpointURL}`, data));
};

const getAllProviders = async () => {
  return axios.get(`${endpointURL}`);
};

const getProviderById = async (providerId: any) => {
  console.log(providerId)
  return to(axios.get(`${endpointURL}/${providerId.providerID}`));
};

const updateProvider = async (providerId: any, data: any) => {
  return axios.put(`${endpointURL}/${providerId}`, data);
};

const deleteProvider = async (providerId: any) => {
  return axios.delete(`${endpointURL}/${providerId}`);
};

const providerService = {
  createProvider,
  getAllProviders,
  getProviderById,
  updateProvider,
  deleteProvider
};

export default providerService;
