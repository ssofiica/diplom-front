import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import MenuPage from './pages/menu';
import Header from './pages/header';
import OrderPage from './pages/orders';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/order" element={<OrderPage />} />
      </Routes>
    </Router>
  );
}

export default App
