import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

import { useNavigate, Link } from 'react-router-dom';
import Login from '../commons/Login';
import { User } from '../models/User';

export const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('loginId:', loginId);
    console.log('Password:', password);

    const res = await axios.get<User>(`${import.meta.env.VITE_REACT_APP_API_URL}/users/${loginId}`)
    if (password == res.data.password) {
      Login(res.data.id, res.data.name, res.data.userGroupId);
      navigate("/");
    } else {
      alert("パスワードが一致しません");
      return
    }
  };

  return (
    <div className='form-div'>
        <form 
        onSubmit={handleSubmit} 
        className="form">
          <h2 className="text-2xl mb-4">Login</h2>
          <div className="mb-6">
          <label className="form-label" htmlFor="loginId">
            loginId
          </label>
          <input
              type="text"
              id="loginId"
              className="form-input"
              placeholder="ログインID"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
          />
          </div>
          <div className="mb-6">
            <label className="form-label" htmlFor="password">Password</label>
            <input
                type="text"
                id="password"
                className="form-input"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>
          <div>
            {/* <button type="submit" className="btn-black">ログイン</button> */}
            <Button variant="contained" color="inherit" type="submit">
              ログイン
            </Button>
          </div>
          <div>
            新規登録は<Link to="/signup" className='text-sky-600'>こちら</Link>から
          </div>
        </form>
    </div>  
  );
};

export default SignIn;