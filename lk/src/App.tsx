import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import MenuPage from './pages/menu';
import Header from './pages/header';
import OrderPage from './pages/orders';
import InfoPage from './pages/info';
import AnalyticsPage from './pages/analytics';
import AuthPage from './pages/auth';
import { ReactElement } from 'react';
import { getTokenFromStorage, isTokenValid } from './pages/jwt/token';

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  

  return (
    <>
      {!isLoginPage && <Header />}
      <Routes>
        <Route path="/menu" element={<PrivateRoute element={<MenuPage />}  />} />
        <Route path="/order" element={<PrivateRoute element={<OrderPage />}  />} />
        <Route path="/info" element={<PrivateRoute element={<InfoPage />} />} />
        <Route path="/analytics" element={<PrivateRoute element={<AnalyticsPage />} />} />
        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </>
  );
}

export default App;


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
