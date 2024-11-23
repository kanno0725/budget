import React, { type Dispatch, useState, useEffect, useMemo } from 'react';
import axios from 'axios';

import { MRT_RowSelectionState } from 'material-react-table';

import { GetPayment } from '../models/Payment';
import { User } from '../models/User';

import LiquidationPaymentTable from '../components/LiquidationPaymentTable';
import LiquidationTable from '../components/LiquidationTable';


export type RowSelectionState = {
  [rowIndex: number]: boolean;
};

const Liquidation_test: React.FC = () => {
  const [payments, setPayments] = useState<GetPayment[] | null>();
  const [users, setUsers] = useState<User[] | null>();
  const [checkedData, setCheckedData] = useState<GetPayment[] | null | undefined>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<MRT_RowSelectionState>({});

  const fetchPayments = async () => {
    try {
      const res = await axios.get<GetPayment[]>(`${import.meta.env.VITE_REACT_APP_API_URL}/payments/${localStorage.getItem('usergroupid_str')}/group-payments`);
      res.data.forEach(el => {
        el.paymentDatetime = new Date(el.paymentDatetime).toLocaleDateString()
      });
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>(`${import.meta.env.VITE_REACT_APP_API_URL}/users/${localStorage.getItem('usergroupid_str')}/group-users`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchUsers();
  }, []);

  useEffect(() => {
    setCheckedData(payments?.filter((el) => Object.keys(selectedRowIds).includes(String(el.id))))
  }, [selectedRowIds]);

  const onLiquidate = async () => {
    // 清算フラグを立てる
    const contents: string[] = []
    checkedData?.forEach((el) =>{
      contents.push(`${el.id}`)
    })
    try {
      await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/payments/liquidate`, {
        ids: contents
      });
    } catch (err) {
      console.error(err);
    }
    // 選択解除
    // setcheckedData([])
    setSelectedRowIds({})
    // payment再読み込み
    fetchPayments();
    alert('清算を完了しました');
  }

  return (
    <div className="container my-4">
      <div className=""> 
        <LiquidationPaymentTable 
          payments={payments} 
          selectedRowIds={selectedRowIds}
          setSelectedRowIds={setSelectedRowIds}
        />
      </div>
      <div className=''>
        清算方法
        <LiquidationTable checkedData={checkedData} users={users} />
        <button type="submit" className="btn-black"onClick={onLiquidate} >清算</button>
      </div>
    </div>
  );
};

export default Liquidation_test;