import { axios } from '@/utils/axios';

// Function to create a new user
const createUser = async (data: any) => {
  return axios.post('/users', data);
};

// Function to retrieve all users
const getAllUsers = async () => {
  return axios.get('/users');
};

// Function to retrieve a single user by ID
const getUserById = async (userId: any) => {
  return axios.get(`/users/${userId}`);
};

// Function to update a user's details
const updateUser = async (userId: any, data: any) => {
  return axios.put(`/users/${userId}`, data);
};

// Function to delete a user
const deleteUser = async (userId: any) => {
  return axios.delete(`/users/${userId}`);
};

// Object that groups all user services
const userService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};

export default userService;
