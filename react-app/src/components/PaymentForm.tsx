import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PaymentCategory } from '../models/PaymentCategory';
import { toISOStringWithTimezone } from '../utils/Time';
import { GetPayment } from '../models/Payment';

const PaymentForm = (props: {
  formPayment?: GetPayment | null | undefined;
}
) => {
  const [id, setId] =  useState(props.formPayment?.id? props.formPayment?.id:'');
  const [name, setName] =  useState(props.formPayment?.name? props.formPayment?.name:'');
  const [price, setPrice] = useState(props.formPayment?.price? props.formPayment?.price:'');
  const [paymentDatetime, setPaymentDatetime] = useState(props.formPayment?.paymentDatetime? props.formPayment?.paymentDatetime:'');
  const [selectedPaymentCategoryId, setSelectedPaymentCategoryId] = useState(props.formPayment?.paymentCategoryId? props.formPayment?.paymentCategoryId:'');
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

 const apiCallSuccess = () => {
  alert('支払いが登録されました');
  // 入力欄をクリア
  setId('');
  setName('');
  setPrice('');
  setPaymentDatetime('');
  setSelectedPaymentCategoryId('')
 }

 const apiCallError = (e: number) => {
  console.log("error")
  console.log(e)
  alert(`支払い登録失敗 error code = ${e}`);
  setError('error...');
 }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if ( id !== '' ){
        console.log(id)
        await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/payments/${id}`, {
          name: name,
          price: Number(price),
          paymentDatetime: toISOStringWithTimezone(new Date(paymentDatetime)),
          paymentCategoryId: selectedPaymentCategoryId,
          paymentUserId: Number(localStorage.getItem('userid_str')),
          loadRate: 50
        })
        .then((res) => {
          if(res.status == 200) {
            apiCallSuccess()
          } else {
            alert(`支払い登録失敗 error code = ${res.status}`);
          }
        })
        .catch((e) => {
          if (axios.isAxiosError(e) && e.response) {
            apiCallError(e.response?.status)
          }
        })
      }else{
        await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/payments`, {
          name: name,
          price: Number(price),
          paymentDatetime: toISOStringWithTimezone(new Date(paymentDatetime)),
          paymentCategoryId: selectedPaymentCategoryId,
          paymentUserId: Number(localStorage.getItem('userid_str')),
          loadRate: 50
        })
        .then((res) => {
          if(res.status == 201) {
            apiCallSuccess()
          } else {
            alert(`支払い登録失敗 error code = ${res.status}`);
          }
        })
        .catch((e) => {
          if (axios.isAxiosError(e) && e.response) {
            apiCallError(e.response?.status)
          }
        })
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSelectOption = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPaymentCategoryId = Number(e.target.value);
    setSelectedPaymentCategoryId(selectedPaymentCategoryId)  
  };

  return (
    <div>
      <div className="container m-4">
        <form onSubmit={handleSubmit} >
          {/* <h2 className="text-3xl mb-4">登録画面</h2> */}
          <div className="grid grid-cols-5 gap-2">
            <label className="col-span-1 text-xl" htmlFor="name">
              品目名
            </label>
            <div className="col-span-4 text-xl">
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
            <label className="col-span-1 text-xl" htmlFor="price">
              金額
            </label>
            <div className="col-span-4 text-xl">
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
            <label className="col-span-1 text-xl" htmlFor="paymentDatetime">
              日付
            </label>
            <div className="col-span-4 text-xl">
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
            {/* {paymentDatetime}
            {toISOStringWithTimezone(new Date(paymentDatetime))} */}
            {id}
            {/* {toISOStringWithTimezone(new Date(paymentDatetime))} */}
            {/* <label className="form-label" htmlFor="userGroupId">カテゴリー</label> */}
            <label className="col-span-1 text-xl">
            分類
            </label>
            <div className="col-span-4 text-xl">
              <select
                value={selectedPaymentCategoryId}
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
            <div className="col-span-3">
              <button type="submit" className="btn-black">登録</button>
            </div>
          </div>
        </form>
      </div>
    </div>

  );
};

export default PaymentForm;