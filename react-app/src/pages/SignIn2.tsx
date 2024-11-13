import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios'; 

type User = {
    id: number;
    name: string;
    loginId: string;
    password: string;
    userGroupId: number;
    themeColor: string;
  };

const Login2: React.FC = () => {
  const navigate = useNavigate();
  console.log('レンダリング')
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  // const handleSubmit = async () => (e: React.FormEvent) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('loginId:', loginId);
    console.log('Password:', password);
    // alert("stop")
  };

  return (
    <div className='form-div'>
    <form onSubmit={handleSubmit} 
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
      <button type="submit" className="btn-black">ログイン</button>
    </form>
    <Link to="/signup">新規登録はこちらから</Link>
</div>
  );
};

export default Login2;
