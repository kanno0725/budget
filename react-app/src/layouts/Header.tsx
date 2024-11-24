import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
} from '@mui/material';

import './Header.css'; // Headerコンポーネントに対応するCSSファイルをインポート
import { Logout } from '../commons/Login';


const Header: React.FC = () => {
  const navigate = useNavigate();
  
  const onLogout = () => {
    Logout();
    navigate('/signin')
  }

  const Account = () => {
    const userName = localStorage.getItem("username");
    if(userName != null) {
      return (
        <div>
          <span>ユーザー：{userName} </span>
          <Button variant="outlined" color="inherit" onClick={() => onLogout()}>
            ログアウト
          </Button>
        </div>

      )
    }else{
      return (
        // <button type="submit" className="btn-white" onClick={() => navigate('/signin')}>
        //   Login
        // </button>
        <Button variant="outlined" color="inherit" onClick={() => navigate('/signin')}>
          ログイン
        </Button>
      )
    }
  }

  return (
    <header className="layout-components header">
      <Link to="/" className="logo">
        test
      </Link>
      <Account />
    </header>
  );
};

export default Header;