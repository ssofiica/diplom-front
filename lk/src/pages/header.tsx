import React from 'react';
import { Link } from 'react-router-dom';
import './css/nav.css'

const Header: React.FC = () => {
    return (
        <header style={styles.header}>
            <div style={styles.logo}>Название</div>
            <nav className="nav">
                <Link to="/menu" className="link">Меню</Link>
                <Link to="/order" className="link">Заказы</Link>
            </nav>
            <button>Кнопка</button>
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
    } as React.CSSProperties,
};

export default Header;