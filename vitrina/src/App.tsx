import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import MainPage from './pages/main';
import BasketPage from './pages/basket';
import ProfilePage from './pages/profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<MainPage />} />
        <Route path="/basket" element={<BasketPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App
