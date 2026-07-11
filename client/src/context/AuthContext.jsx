import React, { useState, useEffect, useCallback, useMemo, createContext, useContext } from 'react';
import axios from 'axios';

// components
import Loading from '../components/ui/Loading';

// Konfiguracja API - instancja axiosa dla całego projektu
const api = axios.create({
  baseURL: 'http://localhost:5001', // Twój adres backendu
  withCredentials: true,
});

// user context
const UserContext = createContext(null);

// user provider
function UserProvider(props) {
  const [user, setUser] = useState("loading"); // "loading" | null | userObj
  const [isSubmitting, setIsSubmitting] = useState(false); // Do blokowania przycisków w UI

  // fetch user on mount
  useEffect(() => {
    api.get('/api/user/profile')
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        setUser(null); // Brak zalogowanego użytkownika
      });
  }, []);

  const login = useCallback(async (data) => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/api/auth/login', data);
      //setUser(response.data);
      console.log('response:', response.data)
      setUser(response.data.data.user); // Zakładam, że backend zwraca obiekt user w odpowiedzi
    } catch (error) {
      console.error("Błąd logowania:", error);
      throw error; // Przekazujemy błąd do komponentu, aby wyświetlić komunikat
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await api.post('/api/auth/logout');
      setUser(null);
    } catch (error) {
      console.error("Błąd wylogowania:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // memo functions to optimise re-renders
  const contextValue = useMemo(() => ({
    user,
    login,
    logout,
    isSubmitting, // Dodane, aby komponenty mogły np. wyłączyć przycisk
  }), [user, login, logout, isSubmitting]);

  // loading user
  if (user === "loading") {
    return <Loading />;
  }

  return (
    <UserContext.Provider value={contextValue} {...props} />
  );
}

// custom hook do korzystania z user context, 
function useUser() {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser() must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUser };