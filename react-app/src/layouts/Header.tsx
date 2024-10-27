import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // Headerコンポーネントに対応するCSSファイルをインポート
import { Logout } from '../commons/Login';


const Header: React.FC = () => {
  const navigate = useNavigate();
  
  const onLogout = () => {
    Logout();
    navigate('/signin')
  }

  const HogeComponent = () => {
    const userName = localStorage.getItem("username");
    if(userName != null) {
      return (
        <div>
          <span>ユーザー：{userName} </span>
          <button type="submit" className="btn-white" onClick={() => onLogout()}>
            Logout
          </button>
        </div>

      )
    }else{
      return (
        <button type="submit" className="btn-white" onClick={() => navigate('/signin')}>
          Login
        </button>
      )
    }
  }

  return (
    <header className="layout-components header">
      <Link to="/" className="logo">
        test
      </Link>
      <HogeComponent />
    </header>
  );
};

export default Header;