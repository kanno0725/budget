import React, { type Dispatch, useState, useEffect, useMemo } from 'react';
import axios from 'axios';

import { GetPayment } from '../models/Payment';
import { User } from '../models/User';
// import Table from '../components/table';

type PayedUser = {
  payUserName: string,
  price: number
}

type LiquidationRes = {
  payUserName: string,
  receivedUserName: string,
  price: number
}

function PaymentsTable(props: { 
  payments: GetPayment[] | null | undefined,
  checkedDataPar: GetPayment[] | null | undefined
  setcheckedDataPar: Dispatch<React.SetStateAction<GetPayment[] | null | undefined>>
}) {
  const rows: JSX.Element[] = [];

  props.payments?.forEach(el => {
    rows.push(
      <tr key={el.id}>
        <td className='text-left'>
          <input
            type="checkbox"
            checked={props.checkedDataPar?.includes(el)}
            onChange={() => {
              if (props.checkedDataPar == null) {
                props.setcheckedDataPar([el])
              } else if (props.checkedDataPar?.includes(el)) {
                props.setcheckedDataPar(
                  props.checkedDataPar.filter((d) => (d !== el))
                )
              } else {
                props.setcheckedDataPar([...props.checkedDataPar, el])
              }
            }}
          />
        </td>
        <td className='text-left'>{el.paymentDatetime}</td>
        <td className='text-left'>{el.name}</td>
        <td className='text-left'>{el.price}</td>
        <td className='text-left'>{el.paymentUserName}</td>
        <td className='text-left'>
          <div className='p-1 mr-3 rounded-lg text-center' style={{backgroundColor: el.paymentCategoryColor}}>
            {el.paymentCategoryName}
          </div>
        </td>
      </tr>
    )
  });
  return (
    <table className='min-w-full divide-y divide-gray-200 dark:divide-neutral-700'>
      <thead>
        <tr>
          <th className='text-left'>選択</th>
          <th className='text-left'>日付</th>
          <th className='text-left'>品目名</th>
          <th className='text-left'>金額</th>
          <th className='text-left'>立て替え</th>
          <th className='text-left'>分類</th>
        </tr>
      </thead>
      <tbody className="">{rows}</tbody>
    </table>
  );
};

function LiquidationDisplay(props: { 
  LiquidationResult: LiquidationRes[],
}) {
  const rows: JSX.Element[] = [];

  props.LiquidationResult?.forEach(el => {
    rows.push(
      <p key={el.payUserName}>{el.payUserName} → {el.receivedUserName} {el.price}円</p>
    )
  });
  return (
    <div>{rows}</div>
  );
};

const Liquidation_old: React.FC = () => {
  const [payments, setPayments] = useState<GetPayment[] | null>();
  const [users, setUsers] = useState<User[] | null>();
  const [checkedData, setcheckedData] = useState<GetPayment[] | null | undefined>([]);

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

  const liquidationResult: LiquidationRes[] = useMemo(() => {
    let PayedUsers: PayedUser[] = []
    const LiquidationResult: LiquidationRes[] = []
    if(checkedData !== undefined) {
      if (checkedData !== null && checkedData.length > 0) {
        // 全体の負担額を計算
        const totalCost = checkedData.map(d => d.price).reduce((acc, score) => acc + score, 0);
        // 
        if(users !== undefined && users !== null) {
          // PayedUserのリストを作成
          users.forEach((user) => {
            const userTotalCost = checkedData.filter((d) => d.paymentUserId == user.id).map(d => d.price).reduce((acc, score) => acc + score, 0);
            PayedUsers.push({
              payUserName: user.name,
              price: userTotalCost
            })
          })
          // 清算結果を計算
          const userNum = users?.length
          for (let i:number = 0; i < userNum - 1; i++) {
            const maxPayUser = PayedUsers.reduce((a,b)=>a.price>b.price?a:b)
            const minPayUser = PayedUsers.reduce((a,b)=>a.price<b.price?a:b)
            const liqPrice = (totalCost / userNum) - minPayUser.price
            // 最小負担者と負担の平均値の差額が0になったら計算終了
            if(liqPrice == 0 ){
              break
            }
            LiquidationResult.push(
              {
                payUserName: minPayUser.payUserName,
                receivedUserName: maxPayUser.payUserName,
                price: liqPrice
              }
            )
            PayedUsers = PayedUsers.filter(function(x){return x.payUserName !== maxPayUser.payUserName});
            PayedUsers = PayedUsers.filter(function(x){return x.payUserName !== minPayUser.payUserName});
            maxPayUser.price -= liqPrice
            minPayUser.price += liqPrice

            PayedUsers.push(maxPayUser)
            PayedUsers.push(minPayUser)
          } 
        }
      }
    }
    return LiquidationResult;
  }, [checkedData]);

  useEffect(() => {
    fetchPayments();
    fetchUsers();
  }, []);

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
    setcheckedData([])
    // payment再読み込み
    fetchPayments();
    alert('清算を完了しました');
  }

  return (

    <div className="container my-4">
		  {/* <h2 className="text-2xl mb-4">清算画面</h2> */}
    {/* <Table data= {data}/> */}
      <div className=''>
      <div className="overflow-auto h-1/2 ...">
        <PaymentsTable payments={payments} checkedDataPar={checkedData} setcheckedDataPar={setcheckedData} />
      </div>
      </div>
      <div className='pr-4'>
        清算結果
        <LiquidationDisplay LiquidationResult={liquidationResult} />
        <button type="submit" className="btn-black"onClick={onLiquidate} >清算</button>
      </div>
    </div>
  );
};

export default Liquidation_old;