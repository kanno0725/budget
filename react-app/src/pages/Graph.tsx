import React, { type Dispatch, useState, useEffect } from 'react';
import axios from 'axios';
import { MdEdit, MdDelete } from "react-icons/md";
import { GetPayment } from '../models/Payment';
import { PaymentCategory } from '../models/PaymentCategory';
import BaseModal from '../components/modals/BaseModal';

function PaymentsTable(props: { 
    payments: GetPayment[] | null | undefined;
    showModal: boolean;
    setShowModal: Dispatch<React.SetStateAction<boolean>>
    fetchPayments: () => Promise<void>;
  }) {
  
  const rows: JSX.Element[] = [];
  const onEdit = async (payment: GetPayment) => {
    props.setShowModal(true)
    console.log(payment.name)
  }
  const onDelete = async (payment: GetPayment) => {
    try {
      await axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/payments/${payment.id}`);
    } catch (err) {
      console.error(err);
    }
    props.fetchPayments();
  }
  props.payments?.forEach(el => {
    rows.push(
      <tr key={el.id}>
        <td className='text-left'>{el.paymentDatetime}</td>
        <td className='text-left'>{el.name}</td>
        <td className='text-left'>{el.price}</td>
        <td className='text-left'>
          <div className='p-1 mr-3 rounded-lg text-center' style={{backgroundColor: el.paymentCategoryColor}}>
            {el.paymentCategoryName}
          </div>
        </td>
        <td className='text-left'>
          <button type="submit" onClick={() => onEdit(el)} ><MdEdit /></button>
        </td>
        <td className='text-left'>
          <button type="submit" onClick={() => onDelete(el)} ><MdDelete /></button>
        </td>
      </tr>
    )
  });
  return (
    <div>
      <table className='min-w-full divide-y divide-gray-200 dark:divide-neutral-700'>
        <thead>
          <tr>
            <th className='text-left'>日付</th>
            <th className='text-left'>品目名</th>
            <th className='text-left'>金額</th>
            <th className='text-left'>カテゴリー</th>
            <th className='text-left'></th>
            <th className='text-left'></th>
          </tr>
        </thead>
        <tbody className="">{rows}</tbody>
      </table>
    </div>

  );
};



const Grapgh: React.FC = () => {
  const [payments, setPayments] = useState<GetPayment[] | null>();
  const [paymentCategories, setPaymentCategories] = useState<PaymentCategory[] | null>();
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchPayments = async () => {
    try {
      const res = await axios.get<GetPayment[]>(`${import.meta.env.VITE_REACT_APP_API_URL}/payments/${localStorage.getItem('userid_str')}/user-payments`);
      res.data.forEach(el => {
        el.paymentDatetime = new Date(el.paymentDatetime).toLocaleDateString()
      });
      setPayments(res.data);
      console.log(payments)
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPayments();
    console.log("done")
  }, []);

  return (
    <div>
      <BaseModal showFlag={showModal} showModal={showModal} setShowModal={setShowModal} />
      <h2 className="text-2xl mb-4">履歴</h2>
        <div className='p-5'>
          <PaymentsTable payments={payments} showModal={showModal} setShowModal={setShowModal} fetchPayments={fetchPayments} />
        </div>
    </div>
  );
};

export default Grapgh;