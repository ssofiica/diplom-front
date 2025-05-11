import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import MenuPage from './pages/menu';
import Header from './pages/header';
import OrderPage from './pages/orders';
import InfoPage from './pages/info';
import AnalyticsPage from './pages/analytics';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </Router>
  );
}

export default App
