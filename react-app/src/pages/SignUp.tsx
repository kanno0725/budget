import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

import Login from '../commons/Login';
import { UserGroup } from '../models/UserGroups';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [selectedUserGroup, setSelectedUserGroup] = useState<UserGroup | null | undefined>();
  const [themeColor, setThemeColor] = useState('');
  const [isArrowActive, setArrowActive] = useState(false);
  const [userGroups, setUserGroups] = useState<UserGroup[] | null>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const res = await axios.get<UserGroup[]>(`${import.meta.env.VITE_REACT_APP_API_URL}/usergroups`);
        setUserGroups(res.data);
        console.log("done")
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserGroups();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/users`, {
        name: name,
        loginId: loginId,
        password: password,
        userGroupId: selectedUserGroup?.id,
        themeColor: themeColor
      });
      if(res.status == 201) {
        alert('アカウントが作成されました');
        // ログインも行う
        Login(res.data.id, res.data.name, res.data.userGroupId);
        navigate("/")
      } else {
        alert(`アカウント作成失敗 error code = ${res.status}`);
      }
    } catch (error) {
      setError('error...');
    }
  };

  const handleSelectOption = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserGroupId = Number(e.target.value);
    const selectedUserGroup = userGroups?.find((option) => option.id === selectedUserGroupId);
    setSelectedUserGroup(selectedUserGroup)  
  };


  return (
    <div className='form-div'>
    <form 
    onSubmit={handleSubmit} 
    className="form">
      <h2 className="text-2xl mb-4">ユーザー登録</h2>
      <div className="mb-6">
      <label className="form-label" htmlFor="name">
        名前
      </label>
      <input
          type="text"
          id="name"
          className="form-input"
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
      />
      </div>
      <div className="mb-6">
        <label className="form-label" htmlFor="loginId">ログインID</label>
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
        <label className="form-label" htmlFor="userGroupId">ユーザーグループ</label>
        <select
          value={selectedUserGroup?.id || ''}
          onChange={handleSelectOption}
          onFocus={() => setArrowActive(true)}
          onBlur={() => setArrowActive(false)}
        >
          <option value="">選択してください</option>
          {userGroups?.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        {selectedUserGroup?.id}
      </div>
      <div className="mb-6">
        <label className="form-label" htmlFor="themeColor">テーマカラー</label>
        <input
            type="color"
            id="themeColor"
            // className="form-input"
            placeholder="テーマカラー"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            required
        />
        { themeColor }
      </div>
      <div>
        {/* <button type="submit" className="btn-black">登録</button> */}
        <Button variant="contained" color="inherit" type="submit">
          登録
        </Button>
      </div>
    </form>
    </div>
  );
};

export default SignUp;