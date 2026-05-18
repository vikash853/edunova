import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Token se user load karo on page refresh
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) { setLoading(false); return; }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.warn('Token invalid:', err?.response?.status);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // LOGIN — role ke hisaab se redirect
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user: loggedInUser } = res.data;
    if (!token || !loggedInUser) throw new Error('Invalid response from server');
    localStorage.setItem('token', token);
    setUser(loggedInUser);

    // ✅ YAHAN redirect hota hai — role check karo
    if (loggedInUser.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { token, user: newUser } = res.data;
    if (!token || !newUser) throw new Error('Invalid response from server');
    localStorage.setItem('token', token);
    setUser(newUser);
    navigate('/dashboard', { replace: true });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login', { replace: true });
  };

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
