import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/')
  };
//   username: string, password: string

  const LoginProcess = async () => {
    console.log('Username:', username);
    console.log('Password:', password);
    // ここでAPIにリクエストを送信する処理を追加できます
    await localStorage.setItem("Username", username);
    const loggedIn = localStorage.getItem("Username");
    console.log('logined:', loggedIn);
    console.log('logined:', loggedIn != null);
    await navigate('/')
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="text-2xl mb-4">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>
        <button type="submit" className="btn" onClick={() => LoginProcess()}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
