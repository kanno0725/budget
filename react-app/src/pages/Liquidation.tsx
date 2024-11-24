import React, { type Dispatch, useState, useEffect, useMemo } from 'react';
import axios from 'axios';

import { MRT_RowSelectionState } from 'material-react-table';
import { Button } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import { GetPayment } from '../models/Payment';
import { User } from '../models/User';

import LiquidationPaymentTable from '../components/LiquidationPaymentTable';
import LiquidationTable from '../components/LiquidationTable';

const Liquidation: React.FC = () => {
  const [payments, setPayments] = useState<GetPayment[] | null>();
  const [users, setUsers] = useState<User[] | null>();
  const [checkedData, setCheckedData] = useState<GetPayment[] | null | undefined>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<MRT_RowSelectionState>({});
  const [selectedYear, setSelectedYear] = useState(`${new Date().getFullYear()}`);
  const [selectedMonth, setSelectedMonth] = useState(`${new Date().getMonth() + 1}`);

  const fetchPayments = async (year: string, month: string) => {
    try {
      const res = await axios.get<GetPayment[]>(`${import.meta.env.VITE_REACT_APP_API_URL}/payments/userGroup?groupId=${localStorage.getItem('usergroupid_str')}&year=${year}&month=${month}`);
      res.data.forEach(el => {
        // el.paymentDatetime = new Date(el.paymentDatetime).toLocaleDateString()
      });
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>(`${import.meta.env.VITE_REACT_APP_API_URL}/users/userGroup?userGroupId=${localStorage.getItem('usergroupid_str')}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 画面読み込み時のデータ取得
  useEffect(() => {
    fetchPayments(selectedYear, selectedMonth);
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
    setSelectedRowIds({})
    // payment再読み込み
    fetchPayments(selectedYear, selectedMonth)
    alert('清算を完了しました')
  }
  const selectYearMonth = (value: string) => {
    const [formYear, formMonth] = value.split('-');
    setSelectedYear(formYear)
    setSelectedMonth(formMonth)
    fetchPayments(formYear, formMonth)
  }

  return (
    <div className="container">
      <input type="month"
        value={`${selectedYear}-${selectedMonth}`}
        onChange={(e)=>selectYearMonth(e.target.value)}
        className='m-1 font-medium text-lg w-36'
      ></input>
      <div className=""> 
        <LiquidationPaymentTable 
          payments={payments} 
          selectedRowIds={selectedRowIds}
          setSelectedRowIds={setSelectedRowIds}
        />
      </div>
      <div className='m-2'>
        <span className='font-medium text-lg'>清算方法</span>
        <div className='h-24 overflow-y-auto border-2'>
          <LiquidationTable checkedData={checkedData} users={users} />
        </div>
        <div className='my-1'>
          <Button variant="contained" color="inherit" onClick={onLiquidate}>
            清算
          </Button>
        </div>

        {/* <button type="submit" className="btn-black" onClick={onLiquidate} >清算</button> */}
      </div>
    </div>
  );
};

export default Liquidation;