import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // Headerコンポーネントに対応するCSSファイルをインポート



const Header: React.FC = () => {
  const navigate = useNavigate();
  
  const Logout = () => {
    localStorage.clear();
    navigate('/Signin')
  }

  const Login = () => {
    navigate('/signin')
  }

  const HogeComponent = () => {
    const userName = localStorage.getItem("username");
    if(userName != null) {
      return (
        <div>
          <span>ユーザー：{userName} </span>
          <button type="submit" className="btn-white" onClick={() => Logout()}>
            Logout
          </button>
        </div>

      )
    }else{
      return (
        <button type="submit" className="btn-white" onClick={() => Login()}>
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