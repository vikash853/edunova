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
        // Most common: 401 = invalid/expired token → clean up silently
        localStorage.removeItem('token');
        setUser(null);
        // Optional: only redirect if you're on a protected page
        // if (window.location.pathname.startsWith('/dashboard') || ...) navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      if (!token || !user) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem('token', token);
      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      console.error("Login failed:", err);
      alert('Login failed: ' + (err.response?.data?.message || 'Please check your credentials'));
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      const { token, user } = res.data;

      if (!token || !user) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem('token', token);
      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      console.error("Register failed:", err);
      alert('Registration failed: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const updateUser = async (data) => {
    try {
      const res = await api.put('/auth/update', data);
      setUser(res.data);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.message || 'Error'));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};