import React, { type Dispatch, useState, useEffect } from 'react';
import axios from 'axios';
import { PaymentCategory } from '../models/PaymentCategory';
import PaymentCategoryTable from '../components/PaymentCategoryTable';


const Settings: React.FC = () => {
  const [paymentCategories, setPaymentCategories] = useState<PaymentCategory[] | null>();
  const [reFetchFlag, setReFetchFlag] = useState(true);

  const fetchPaymentCategories = async () => {
    try {
      const res = await axios.get<PaymentCategory[]>(`${import.meta.env.VITE_REACT_APP_API_URL}/paymentCategories?userGroupId=${localStorage.getItem('usergroupid_str')}`);
      setPaymentCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (reFetchFlag) {
      fetchPaymentCategories()
    }
    setReFetchFlag(false)
  }, [reFetchFlag]);

  return (
    <div className="container">
      <div className="">
          <PaymentCategoryTable paymentCategories={paymentCategories} setReFetchFlag={setReFetchFlag} />
        </div>
    </div>
  );
};

export default Settings;