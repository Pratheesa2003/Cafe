import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [email, setEmail] = useState(() => localStorage.getItem('cafe_email'));
  const [role, setRole] = useState(() => localStorage.getItem('cafe_role'));
  const [token, setToken] = useState(() => localStorage.getItem('cafe_token'));

  const login = useCallback(async (emailInput, password) => {
    const res = await api.login(emailInput, password);
    localStorage.setItem('cafe_token', res.token);
    localStorage.setItem('cafe_email', res.email);
    localStorage.setItem('cafe_role', res.role);
    setToken(res.token);
    setEmail(res.email);
    setRole(res.role);
    return res;
  }, []);

  const register = useCallback(async (payload) => {
    return api.register(payload);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('cafe_token');
    localStorage.removeItem('cafe_email');
    localStorage.removeItem('cafe_role');
    setToken(null);
    setEmail(null);
    setRole(null);
  }, []);

  const value = {
    email,
    role,
    token,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
