
import React, { type Dispatch, useState, useEffect, useMemo } from 'react';

import { GetPayment } from '../models/Payment';
import { User } from '../models/User';

type PayedUser = {
    payUserName: string,
    price: number
  }
  
  type LiquidationRes = {
    payUserName: string,
    receivedUserName: string,
    price: number
  }

const LiquidationTable = (props: { 
    checkedData: GetPayment[] | null | undefined
    users: User[] | null | undefined
  }) => {
    const liquidationResult: LiquidationRes[] = useMemo(() => {
      let PayedUsers: PayedUser[] = []
      const LiquidationResult: LiquidationRes[] = []
      const checkedData: GetPayment[] = props.checkedData ? props.checkedData : []
      const users: User[] = props.users ? props.users : []
  
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
      return LiquidationResult;
    }, [props.checkedData]);
  
    const rows: JSX.Element[] = [];
  
    liquidationResult?.forEach(el => {
      rows.push(
        <p key={el.payUserName}>{el.payUserName} → {el.receivedUserName} {Math.ceil(el.price)}円</p>
      )
    });
    return (
      <div>{rows}</div>
    );
  };

export default LiquidationTable