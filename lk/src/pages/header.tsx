import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/nav.css'

const Header: React.FC = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate("/login")
    };

    return (
        <header style={styles.header}>
            <div style={styles.logo}>  </div>
            <nav className="nav">
                <Link to="/menu" className="link">Меню</Link>
                <Link to="/order" className="link">Заказы</Link>
                <Link to="/analytics" className="link">Аналитика</Link>
            </nav>
            <div style={{display: 'flex', alignItems: 'baseline'}}>
            <Link to="/info">
                <button>Профиль</button>
            </Link>
            <div onClick={handleLogout} style={{marginLeft: '10px', cursor: 'pointer', color: 'red', textAlign: 'right' }}>
              Выйти
            </div>
            </div>
        </header>
    );
};

const styles = {
    header: {
        color: '#000',
        marginBottom: '1.5em',
        width: '90%',
        height: '5em',
        tabSize: '16px',
        textAlign: 'left',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    } as React.CSSProperties,
    logo: {
        fontSize: '20px',
        fontWeight: 'bold',
        width: '90px',
    } as React.CSSProperties,
};

export default Header;