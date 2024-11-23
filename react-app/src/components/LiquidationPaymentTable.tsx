import React, { type Dispatch, useState, useEffect, useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_RowSelectionState,
} from 'material-react-table';

import {
  Box,
} from '@mui/material';
import { parse, format } from 'date-fns';

import { GetPayment } from '../models/Payment';

export type RowSelectionState = {
  [rowIndex: number]: boolean;
};

const LiquidationPaymentTable = (props:{
  payments: GetPayment[] | null | undefined,
  selectedRowIds: MRT_RowSelectionState
  setSelectedRowIds: Dispatch<React.SetStateAction<MRT_RowSelectionState>>
}) => {
  console.log(props.payments)
  // console.log("liquidation table rendering")
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
    enableSorting: false,
    positionPagination: 'none',
    positionGlobalFilter: 'left',
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
        maxHeight: '250px',
        minHeight: '250px',
        overflowY: "auto", 
      },
    },
    // select
    enableStickyHeader: true,
    enableRowSelection: (row) => !row.original.isLiquidated,
    // enableRowSelection: true,
    // rowPinningDisplayMode: 'select-sticky',
    positionToolbarAlertBanner: 'none',
    state: { rowSelection: props.selectedRowIds },
    onRowSelectionChange: props.setSelectedRowIds,
    getRowId: (row) => String(row.id),
    // initialState: {
    // },
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
  });

  return (
    <div >
      <MaterialReactTable table={table} />
    </div>
  );
};

export default LiquidationPaymentTable