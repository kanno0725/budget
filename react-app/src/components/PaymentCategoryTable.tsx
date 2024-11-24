import React, { type Dispatch, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_Row,
  MRT_EditActionButtons,
  MRT_TableOptions,
  createRow,
} from 'material-react-table';

import {
  Box,
  DialogTitle,
  DialogContent,
  Tooltip,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

import { PaymentCategory } from '../models/PaymentCategory';

const PaymentCategoryTable = (props:{
  paymentCategories: PaymentCategory[] | null | undefined,
  setReFetchFlag: Dispatch<React.SetStateAction<boolean>>
}) => {
  const paymentCategories: PaymentCategory[] = props.paymentCategories ? props.paymentCategories : []
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
  const columns = useMemo<MRT_ColumnDef<PaymentCategory>[]>(
    () => [
      {
        accessorKey: 'name',
        header: '名前',
        muiEditTextFieldProps: {
            error: !!validationErrors?.name,
            helperText: validationErrors?.name,
            onFocus: () =>
              setValidationErrors({
                ...validationErrors,
                name: undefined,
              }),
        },
      },
      {
        accessorKey: 'color',
        header: '色',
        Cell: ({ cell, row }) => (
            <Box
              component="span"
              sx={() => ({
                backgroundColor:
                  row.original.color,
                borderRadius: '0.25rem',
                // color: '#fff',
                maxWidth: '9ch',
                p: '0.25rem',
              })}
            >
              {/* {cell.getValue<string>()} */}
              {row.original.color}
            </Box>
        ),
        muiEditTextFieldProps: {
            type: "color",
            error: !!validationErrors?.color,
            helperText: validationErrors?.color,
            onFocus: () =>
              setValidationErrors({
                ...validationErrors,
                color: undefined,
              }),
          },
      },
    ],
    [props.paymentCategories, validationErrors],
  );

  //CREATE action
  const handleCreatePaymentCategory: MRT_TableOptions<PaymentCategory>['onCreatingRowSave'] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validatePaymentCategory(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/paymentCategories`, {
        name: values.name,
        color: values.color,
        userGroupId: Number(localStorage.getItem('usergroupid_str'))
      })
      .then((res) => {
        if(res.status == 201) {
            // alert('支払いが編集されました');
        } else {
          alert(`分類登録失敗 error code = ${res.status}`);
        }
      })
      .catch((e) => {
        if (axios.isAxiosError(e) && e.response) {
          alert(`分類登録失敗 error code = ${e}`)
        }
      })
    table.setCreatingRow(null); //exit creating mode
    props.setReFetchFlag(true) // reload
  };

  //UPDATE action
  const handleSavePaymentCategory: MRT_TableOptions<PaymentCategory>['onEditingRowSave'] = async ({
    values,
    table,
    row,
    }) => {
    const newValidationErrors = validatePaymentCategory(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
    }
    setValidationErrors({});
    await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/paymentCategories/${row.original.id}`, {
        name: values.name,
        color: values.color,
        userGroupId: row.original.userGroupId
      })
      .then((res) => {
        if(res.status == 200) {
            // alert('支払いが編集されました');
        } else {
          alert(`分類登録失敗 error code = ${res.status}`);
        }
      })
      .catch((e) => {
        if (axios.isAxiosError(e) && e.response) {
          alert(`分類登録失敗 error code = ${e}`)
        }
      })
    table.setEditingRow(null) //exit editing mode
    props.setReFetchFlag(true) // reload
  };

  const table = useMaterialReactTable({
    columns,
    data: paymentCategories,
    enableKeyboardShortcuts: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableSorting: false,
    positionPagination: 'none',
    positionGlobalFilter: 'left',
    enableStickyHeader: true,
    // pagenation
    enablePagination: false,
    enableBottomToolbar : false,
    // tool bar
    enableDensityToggle: false,
    enableHiding: false,
    // default table style
    layoutMode: "grid",
    defaultColumn: {
      minSize: 30,
      size: 90,
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
        maxHeight: '300px',
        minHeight: '300px',
        overflowY: "auto", 
      },
    },
    // create
    onCreatingRowSave: handleCreatePaymentCategory,
    onCreatingRowCancel: () => setValidationErrors({}),
    renderTopToolbarCustomActions: ({ table }) => (
        <IconButton
        //   variant="contained"
          onClick={() => {
            // table.setCreatingRow(true); //simplest way to open the create row modal with no default values
            //or you can pass in a row object to set default values with the `createRow` helper function
            table.setCreatingRow(
              createRow(table, {
                id: 0, // set but not use
                name: "",
                color: "#000000",
                userGroupId: Number(localStorage.getItem('usergroupid_str')) // set but not use
                //optionally pass in default values for the new row, useful for nested data or other complex scenarios
              }),
            );
          }}
        >
          {/* 分類作成 */}
          <AddIcon />
        </IconButton>
      ),
    // edit
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
    </Box>
    ),
    onEditingRowSave: handleSavePaymentCategory,
    onEditingRowCancel: () => setValidationErrors({}),
  });

  return (
    <div >
      <MaterialReactTable table={table} />
    </div>
  );
};

const validateRequired = (value: string) => !!value.length;
// const validatePrice = (value: string) => !!value.length && value.match(/^\d+$/)

function validatePaymentCategory(paymentCategory: PaymentCategory) {
  return {
    name: !validateRequired(paymentCategory.name) ? '値が空です' : '',
    color: !validateRequired(paymentCategory.color) ? '値が空です' : '',
  };
}

export default PaymentCategoryTable