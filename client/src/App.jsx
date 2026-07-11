import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage.jsx'
import { Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import { useUser, UserProvider } from './context/AuthContext.jsx';
import Urządzenia from './pages/Urządzenia.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Konto from './pages/Konto.jsx';
import Ustawienia from './pages/Ustawienia.jsx';
import NotFound from './components/ui/NotFound.jsx';

// dla niezalogowanych
function PublicRoute({ children }) {
  const { user } = useUser();
  return user ? <Navigate to="/dashboard" /> : children;
}

// dla zalogowanych
function PrivateRoute({ children }) {
  const { user } = useUser();
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>

        <Route index element={<Navigate to="urządzenia" replace />} />
        <Route path="urządzenia" element={<Urządzenia />} />
        <Route path="ustawienia" element={<Ustawienia />} />
        <Route path="konto" element={<Konto />} />
      </Route>

      <Route path="*" element={<NotFound/>} />
    </Routes>
  )
}

function App() {

  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  )
}

export default App
