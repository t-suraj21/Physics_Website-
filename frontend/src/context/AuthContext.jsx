import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error('Auth verification failed:', err);
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, API_URL]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  };

  const register = async (name, email, password, phone, className) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        phone,
        class: className
      });
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  };

  const adminRegister = async (name, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/admin/register`, {
        name,
        email,
        password
      });
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Admin registration failed. Please try again.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put(`${API_URL}/auth/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Profile update failed.'
      };
    }
  };

  const updateAvatar = async (formData) => {
    try {
      const res = await axios.put(`${API_URL}/auth/avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setUser(prev => prev ? { ...prev, avatar: res.data.avatar } : null);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Avatar upload failed.'
      };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      adminRegister,
      logout,
      updateProfile,
      updateAvatar
    }}>
      {children}
    </AuthContext.Provider>
  );
};
