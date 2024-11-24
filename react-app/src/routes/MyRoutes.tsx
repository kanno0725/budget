import React, {useState} from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Payment from '../pages/Payment';
import HistoryPayment from '../pages/HistoryPayment';
import Settings from '../pages/Settings';
import Liquidation from '../pages/Liquidation';


const MyRoutes: React.FC = () => {
  // const loggedIn = useSelector((state) => state.auth.isSignIn);
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Payment />} />
      <Route path="/HistoryPayment" element={<HistoryPayment />} />
      <Route path="/liquidation" element={<Liquidation />} />
      <Route path="/settings" element={<Settings />} />

      {/* <Route path="/" element={ loggedIn != null ? <Payment /> : <SignIn />} />
      <Route path="/" element={<RequireAuth props={Payment}>} /> */}
      {/* <Route path="/" element={ loggedIn != null ? <Payment /> : <Navigate replace to="/signin" />} /> */}
      {/*<Route path="/graph" element={ loggedIn != null ? <Graph /> : <SignIn />} />
      <Route path="/liquidation" element={ loggedIn != null ? <Liquidation /> : <SignIn />} />
      <Route path="/settings" element={ loggedIn != null ? <Settings /> : <SignIn />} /> */}
    </Routes>
  );
};

export default MyRoutes;