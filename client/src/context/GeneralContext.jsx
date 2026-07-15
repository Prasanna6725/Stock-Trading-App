import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axiosInstance from '../components/axiosInstance';

const GeneralContext = createContext(null);

export function GeneralProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sbstocks_token') || '');
  const [loading, setLoading] = useState(true);
  const [portfolios, setPortfolios] = useState([]);

  const syncProfile = async (activeToken = token) => {
    if (!activeToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axiosInstance.get('/users/profile');
      if (data.success) {
        setUser(data.data);
      } else {
        setUser(null);
        localStorage.removeItem('sbstocks_token');
        setToken('');
      }
    } catch (error) {
      setUser(null);
      setToken('');
      localStorage.removeItem('sbstocks_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncProfile();
  }, []);

  const login = (payload) => {
    localStorage.setItem('sbstocks_token', payload.token);
    setToken(payload.token);
    setUser(payload.user);
  };

  const logout = () => {
    localStorage.removeItem('sbstocks_token');
    setToken('');
    setUser(null);
    setPortfolios([]);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      portfolios,
      setPortfolios,
      setUser,
      setToken,
      login,
      logout,
      syncProfile,
      isAuthenticated: Boolean(user && token),
      isAdmin: user?.role === 'admin',
    }),
    [user, token, loading, portfolios]
  );

  return <GeneralContext.Provider value={value}>{children}</GeneralContext.Provider>;
}

export function useGeneral() {
  const context = useContext(GeneralContext);
  if (!context) {
    throw new Error('useGeneral must be used within GeneralProvider');
  }
  return context;
}
