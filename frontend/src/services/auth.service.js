import api from './api';

const register = (name, email, password, role) => {
  return api.post('/auth/register', { name, email, password, role });
};

const login = (email, password) => {
  return api.post('/auth/login', { email, password }).then((response) => {
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  });
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
