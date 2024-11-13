import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PaymentCategory } from '../models/PaymentCategory';
import { toISOStringWithTimezone } from '../utils/Time';

const Payment: React.FC = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [paymentDatetime, setPaymentDatetime] = useState('');
  const [selectedPaymentCategory, setSelectedPaymentCategory] = useState<PaymentCategory | null | undefined>();
  const [isArrowActive, setArrowActive] = useState(false);
  const [paymentCategories, setPaymentCategories] = useState<PaymentCategory[] | null>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentCategories = async () => {
      try {
        const res = await axios.get<PaymentCategory[]>(`${import.meta.env.VITE_REACT_APP_API_URL}/paymentcategories/${localStorage.getItem('usergroupid_str')}`);
        console.log(`/paymentcategory/${localStorage.getItem('usergroupid_str')}`)
        setPaymentCategories(res.data);
        console.log("done")
      } catch (err) {
        console.error(err);
      }
    };
    fetchPaymentCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/payments`, {
        name: name,
        price: Number(price),
        paymentDatetime: toISOStringWithTimezone(new Date(paymentDatetime)),
        paymentCategoryId: selectedPaymentCategory?.id,
        paymentUserId: Number(localStorage.getItem('userid_str')),
        loadRate: 50
      })
      .then((res) => {
        if(res.status == 201) {
          alert('支払いが登録されました');
          // 入力欄をクリア
          setName('');
          setPrice('');
          setPaymentDatetime('');
          setSelectedPaymentCategory(null)
        } else {
          alert(`支払い登録失敗 error code = ${res.status}`);
        }
      })
      .catch((e) => {
        if (axios.isAxiosError(e) && e.response) {
          console.log("error")
          console.log(e.response?.status)
          alert(`支払い登録失敗 error code = ${e.response?.status}`);
          setError('error...');
        }
      })
    } catch (e) {
      console.log(e);
    }
  };

  const handleSelectOption = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPaymentCategoryId = Number(e.target.value);
    const selectedPaymentCategory = paymentCategories?.find((option) => option.id === selectedPaymentCategoryId);
    setSelectedPaymentCategory(selectedPaymentCategory)  
  };

  return (
    <div className="container m-4">
      <form onSubmit={handleSubmit} >
        <h2 className="text-2xl mb-4">登録画面</h2>
        <div className="grid grid-cols-6 gap-2">
          <label className="col-span-1" htmlFor="name">
            品目名
          </label>
          <div className="col-span-5">
            <input
                type="text"
                id="name"
                className=""
                placeholder="品目名"
                value={name}
                onChange={(e) => setName(e.target.value)}

                required
            />
          </div>
          <label className="col-span-1" htmlFor="price">
            金額
          </label>
          <div className="col-span-5">
            <input
                type="text"
                id="price"
                className=""
                placeholder="金額"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
            />
          </div>
          <label className="col-span-1" htmlFor="paymentDatetime">
            日付
          </label>
          <div className="col-span-5">
            <input
                type="date"
                id="paymentDatetime"
                className=""
                placeholder="日付"
                value={paymentDatetime}
                onChange={(e) => setPaymentDatetime(e.target.value)}
                required
            />
          </div>
          {/* {toISOStringWithTimezone(new Date(paymentDatetime))} */}
          <label className="form-label" htmlFor="userGroupId">カテゴリー</label>
          <div className="col-span-5">
            <select
              value={selectedPaymentCategory?.id || ''}
              onChange={handleSelectOption}
              onFocus={() => setArrowActive(true)}
              onBlur={() => setArrowActive(false)}
            >
              <option value="">選択してください</option>
              {paymentCategories?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button type="submit" className="btn-black col-span-3">登録</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Payment;