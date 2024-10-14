import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // Headerコンポーネントに対応するCSSファイルをインポート

const Header: React.FC = () => {
  const navigate = useNavigate();
  
  const Logout = () => {
    localStorage.clear();
    navigate('/')
  }
  return (
    <header className="layout-components header">
      <Link to="/" className="logo">
        test
      </Link>
      <button type="submit" className="btn" onClick={() => Logout()}>
        Logout
      </button>
    </header>
  );
};

export default Header;