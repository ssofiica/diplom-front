import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css'
import MainPage from './pages/main';
import BasketPage from './pages/basket';
import ProfilePage from './pages/profile';
import AuthPage from './pages/auth';
import { ReactElement } from 'react';
import { getTokenFromStorage, isTokenValid } from './pages/jwt/token';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<MainPage />} />
        <Route path="/basket" element={<BasketPage />} />
        <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
        <Route path="/login" element={<AuthPage />}/>
      </Routes>
    </Router>
  );
}

export default App

const PrivateRoute = ({ element: Element }: { element: ReactElement }) => {
  const tkn = getTokenFromStorage()

  if (tkn === null) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isTokenValid(tkn)) {
    return <Navigate to="/login" replace />;
  }

  return Element;
};