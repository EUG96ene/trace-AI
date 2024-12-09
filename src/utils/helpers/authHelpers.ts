export const setAuthToken = (value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', value);
  }
};
export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};


export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

export const setUser = (value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', value);
  }
};

export const getUser = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user');
  }
  return null;
};
