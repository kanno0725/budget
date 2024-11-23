import React, { type Dispatch, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';

import {
  Box,
} from '@mui/material';
import { parse, format } from 'date-fns';

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

const PaymentsTable = (props: { 
  payments: GetPayment[] | null | undefined,
  checkedDataPar: GetPayment[] | null | undefined
  setcheckedDataPar: Dispatch<React.SetStateAction<GetPayment[] | null | undefined>>
}) => {
  const columns = useMemo<MRT_ColumnDef<GetPayment>[]>(
    () => [
      {
        accessorKey: 'paymentDate',
        header: '日付',
        Cell: ({ cell }) => (
          <Box>
            {format(parse(cell.getValue<string>(), 'yyyy/MM/dd', new Date()), "MM/dd")}
          </Box>
        )
      },
      {
        accessorKey: 'name',
        header: '品目名',
      },
      {
        accessorKey: 'price',
        header: '金額',
      },
      {
        accessorKey: 'paymentUserName',
        header: '立て替え',
      },
      {
        accessorKey: 'paymentCategoryName',
        header: '分類',
        Cell: ({ cell, row }) => (
          <Box
            component="span"
            sx={() => ({
              backgroundColor:
                row.original.paymentCategoryColor,
              borderRadius: '0.25rem',
              // color: '#fff',
              maxWidth: '9ch',
              p: '0.25rem',
            })}
          >
            {cell.getValue<string>()}
          </Box>
        ),
      },
    ],
    [],
  );

  const paymentData: GetPayment[] = props.payments ? props.payments : []

  const table = useMaterialReactTable({
    columns,
    data: paymentData,
    enableKeyboardShortcuts: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    positionPagination: 'none',
    positionGlobalFilter: 'left',
    enableSorting: false,
    // tool bar
    enableDensityToggle: false,
    enableHiding: false,
    // default table style
    layoutMode: "grid",
    defaultColumn: {
      minSize: 30,
      size: 40,
      grow: 1,
      muiTableBodyCellProps: {
        style: { 
          padding: 3,
       },
      },
      muiTableHeadCellProps: {
        style: {
          padding: 3,
       },
      },
      muiFilterCheckboxProps: {
        style: {
          padding: 3,
       },
      }
    },
    muiTablePaperProps: {
      sx: {
        // maxHeight: '300px',
      }
    },
    muiTableContainerProps: {
      sx: {
        overflowX: "hidden",
        maxHeight: '300px',
        overflowY: "auto", 
      },
    },
    // select
    enableRowPinning: true,
    enableRowSelection: true,
    enableStickyHeader: true,
    rowPinningDisplayMode: 'select-sticky',
    positionToolbarAlertBanner: 'none',
    getRowId: (row) => String(row.id),
    initialState: {
    },
    muiTableBodyRowProps: ({ row }) => {
      return {
        sx: {
          //Set a fixed height for pinned rows
          height: row.getIsPinned() ? "36px" : "35px",
        },
      };
    },
  });

  useEffect(() => {
    props.setcheckedDataPar(table.getSelectedRowModel().rows.map((el) => el.original))
  }, [table.getState().rowSelection]);

  return (
    <div >
      <MaterialReactTable table={table} />
    </div>
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

const Liquidation_test: React.FC = () => {
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
      <div className=""> 
        <PaymentsTable payments={payments} checkedDataPar={checkedData} setcheckedDataPar={setcheckedData} />
      </div>
      <div className=''>
        清算方法
        <LiquidationDisplay LiquidationResult={liquidationResult} />
        <button type="submit" className="btn-black"onClick={onLiquidate} >清算</button>
      </div>
    </div>
  );
};

export default Liquidation_test;