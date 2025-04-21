import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import MainPage from './pages/main';
import BasketPage from './pages/basket';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<MainPage />} />
        <Route path="/basket" element={<BasketPage />} />
      </Routes>
    </Router>
  );
}

export default App
