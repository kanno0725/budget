import React, {useState} from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import SignIn from '../pages/SignIn';
import Payment from '../pages/Payment';
import Graph from '../pages/Graph';
import Liquidation from '../pages/Liquidation';
import Settings from '../pages/Settings';

const MyRoutes: React.FC = () => {
  // const loggedIn = useSelector((state) => state.auth.isSignIn);
  const loggedIn = localStorage.getItem("Username");
  return (
    <Routes>
      <Route path="/Signin" element={<SignIn />} />
      <Route path="/" element={ loggedIn != null ? <Payment /> : <Navigate replace to="/signin" />} />
      <Route path="/Graph" element={ loggedIn != null ? <Graph /> : <Navigate replace to="/signin" />} />
      <Route path="/Liquidation" element={ loggedIn != null ? <Liquidation /> : <Navigate replace to="/signin" />} />
      <Route path="/Settings" element={ loggedIn != null ? <Settings /> : <Navigate replace to="/signin" />} />
    </Routes>
  );
};

export default MyRoutes;