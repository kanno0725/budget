import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef, //if using TypeScript (optional, but recommended)
} from 'material-react-table';

interface Person {
    name: string;
    price: number;
  }

export default function Table(data: Person[]) {
  //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
        {
          accessorKey: 'name', //simple recommended way to define a column
          header: '名前',
          muiTableHeadCellProps: { style: { color: 'green' } }, //custom props
          enableHiding: false, //disable a feature for this column
        },
        {
          accessorFn: (originalRow) => String(originalRow.price), //alternate way
          id: 'price', //id required if you use accessorFn instead of accessorKey
          header: '金額',
          Header: <i style={{ color: 'red' }}>Age</i>, //optional custom markup
          Cell: ({ cell }) => <i>{cell.getValue<number>().toLocaleString()}</i>, //optional custom cell render
        },
      ]   ,
    [],
  );
  //pass table options to useMaterialReactTable
  const table = useMaterialReactTable({
    columns,
    data, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableRowSelection: true, //enable some features
    enableColumnOrdering: true, //enable a feature for all columns
    enableGlobalFilter: false, //turn off a feature
  });

  //note: you can also pass table options as props directly to <MaterialReactTable /> instead of using useMaterialReactTable
  //but the useMaterialReactTable hook will be the most recommended way to define table options
  return <MaterialReactTable table={table} />;
}
