import React, { type Dispatch, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_Row,
  MRT_EditActionButtons,
  MRT_TableOptions,
} from 'material-react-table';

import {
  Box,
  DialogTitle,
  DialogContent,
  Tooltip,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { parse, format } from 'date-fns';

import { GetPayment } from '../models/Payment';
import { PaymentCategory } from '../models/PaymentCategory';
import { toISOStringWithTimezone, toFormString } from '../utils/Time';

const HistoryPaymentTable = (props:{
  payments: GetPayment[] | null | undefined,
  paymentCategories: PaymentCategory[] | null | undefined,
  setReFetchFlag: Dispatch<React.SetStateAction<boolean>>
}) => {
  const paymentData: GetPayment[] = props.payments ? props.payments : []
  const paymentCategories: PaymentCategory[] = props.paymentCategories ? props.paymentCategories : []
//   console.log(paymentCategories.map((category) => ({ text: category.name, value: category.name })))
  const columns = useMemo<MRT_ColumnDef<GetPayment>[]>(
    () => [
      {
        accessorKey: 'paymentDate',
        header: '日付',
        Cell: ({ cell }) => (
          <Box>
            {format(parse(cell.getValue<string>(), 'yyyy-MM-dd', new Date()), "MM/dd")}
            {/* parse(cell.getValue<Date>(), 'yyyy-MM-ddTHH:mm:ss.SSSZ', new Date()) */}
          </Box>
        ),
        muiEditTextFieldProps: {
            type: 'date',
          },
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
            {/* {cell.getValue<string>()} */}
            {row.original.paymentCategoryName}
          </Box>
        ),
        // edit
        editVariant: 'select',
        editSelectOptions: paymentCategories.map((category) => ({ text: category.name, value: category.name })),
        muiEditTextFieldProps: {
          select: true,
        },
        
      },
    ],
    [props.paymentCategories],
  );

  //UPDATE action
  const handleSavePayment: MRT_TableOptions<GetPayment>['onEditingRowSave'] = async ({
    values,
    table,
    row,
    }) => {
    // const newValidationErrors = validateUser(values);
    // if (Object.values(newValidationErrors).some((error) => error)) {
    //     setValidationErrors(newValidationErrors);
    //     return;
    // }
    // setValidationErrors({});
    const paymentCategoryId = paymentCategories.filter((el) => el.name == values.paymentCategoryName)[0].id
    await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/payments/${row.original.id}`, {
        name: values.name,
        price: Number(values.price),
        paymentDatetime: toISOStringWithTimezone(new Date(values.paymentDate)),
        paymentCategoryId: paymentCategoryId,
        paymentUserId: Number(localStorage.getItem('userid_str')),
        loadRate: 50
      })
      .then((res) => {
        if(res.status == 200) {
            // alert('支払いが編集されました');
        } else {
          alert(`支払い登録失敗 error code = ${res.status}`);
        }
      })
      .catch((e) => {
        if (axios.isAxiosError(e) && e.response) {
          alert(`支払い登録失敗 error code = ${e}`)
        }
      })
    // await updateUser(values);
    table.setEditingRow(null) //exit editing mode
    props.setReFetchFlag(true) // reload
    };

  //DELETE action
  const openDeleteConfirmModal = async (row: MRT_Row<GetPayment>) => {
    if (window.confirm(`以下の支払いを削除しますか?\n 品目：${row.original.name}\n 金額：${row.original.price}`)) {
        await axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/payments/${row.original.id}`)
        props.setReFetchFlag(true) // reload
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: paymentData,
    enableKeyboardShortcuts: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    positionPagination: 'none',
    positionGlobalFilter: 'left',
    enableStickyHeader: true,
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
        // maxHeight: '400px',
        elevation: 0,
      }
    },
    muiTableContainerProps: {
      sx: {
        overflowX: "hidden",
        maxHeight: '500px',
        minHeight: '500px',
        overflowY: "auto", 
      },
    },
    muiTableBodyRowProps: ({ row }) => {
      return {
        hover: false,
        sx: {
          //Set a fixed height for pinned rows
          // height: row.getIsPinned() ? "36px" : "35px",
          backgroundColor: row.original.isLiquidated ? "#cccccc" : undefined
        },
      };
    },
    // edit
    // getRowId: (row) => String(row.id),
    editDisplayMode: 'modal',
    enableEditing: true,
    muiEditTextFieldProps: {
        required: true,
    },
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
    <>
        <DialogTitle>編集</DialogTitle>
        <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
        {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogContent>
        <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogContent>
    </>
    ),
    renderRowActions: ({ row, table }) => (
    <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
        <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
        </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
        <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
        </IconButton>
        </Tooltip>
    </Box>
    ),
    onEditingRowSave: handleSavePayment,
  });

  return (
    <div >
      <MaterialReactTable table={table} />
    </div>
  );
};

export default HistoryPaymentTable