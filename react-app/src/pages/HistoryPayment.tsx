import React, { type Dispatch, useState, useEffect } from 'react';
import axios from 'axios';
import { GetPayment } from '../models/Payment';
import { PaymentCategory } from '../models/PaymentCategory';
import HistoryPaymentTable from '../components/HistoryPaymentTable'


const HistoryPayment: React.FC = () => {
  const [payments, setPayments] = useState<GetPayment[] | null>();
  const [paymentCategories, setPaymentCategories] = useState<PaymentCategory[] | null>();
  const [reFetchFlag, setReFetchFlag] = useState(true);
  

  const fetchPayments = async () => {
    try {
      const res = await axios.get<GetPayment[]>(`${import.meta.env.VITE_REACT_APP_API_URL}/payments/${localStorage.getItem('userid_str')}/user-payments`);
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPaymentCategories = async () => {
    try {
      const res = await axios.get<PaymentCategory[]>(`${import.meta.env.VITE_REACT_APP_API_URL}/paymentcategories/${localStorage.getItem('usergroupid_str')}`);
      console.log(`/paymentcategory/${localStorage.getItem('usergroupid_str')}`)
      setPaymentCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (reFetchFlag) {
      fetchPayments()
      fetchPaymentCategories()
    }
    setReFetchFlag(false)
  }, [reFetchFlag]);

  return (
    <div className="container">
      <div className="">
          <HistoryPaymentTable payments={payments} paymentCategories={paymentCategories} setReFetchFlag={setReFetchFlag} />
        </div>
    </div>
  );
};

export default HistoryPayment;