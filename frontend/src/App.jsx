import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createContext, useState } from 'react';
import UserLogin from './components/UserLogin';
import AdminLogin from './components/AdminLogin';
import DonorDashboard from './components/DonorDashboard';
import AdminDashboard from './components/AdminDashboard';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

export const AuthContext = createContext(null);

function App() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
  });

  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setAuth({ token, role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuth({ token: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      <Router>
        <Routes>
          <Route path="/login" element={<UserLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/donor/dashboard" 
            element={
              auth.token && auth.role === 'donor' ? (
                <DonorDashboard />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              auth.token && auth.role === 'admin' ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/admin/login" />
              )
            } 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App
