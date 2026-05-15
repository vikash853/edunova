import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.warn("Failed to load user from token:", err?.response?.status, err?.message);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // FIX: throw errors instead of alert() so the calling component can show
  // inline feedback. Never use alert() in a React app.
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    if (!token || !user) throw new Error("Invalid response from server");
    localStorage.setItem('token', token);
    setUser(user);
    navigate('/dashboard');
  };

  // FIX: role param removed entirely — backend always assigns "student"
  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { token, user } = res.data;
    if (!token || !user) throw new Error("Invalid response from server");
    localStorage.setItem('token', token);
    setUser(user);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  // FIX: throw errors instead of alert() so the calling component controls feedback
  const updateUser = async (data) => {
    const res = await api.put('/auth/update', data);
    setUser(res.data);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};