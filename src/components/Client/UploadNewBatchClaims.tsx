"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import DateRangePicker1 from "@/components/DateRangePicker";
import Status from "@/components/Status/Status";
import Export1 from "@/components/Export";
import { useRouter } from 'next/navigation';

// Inside your component:
type Claim = {
  id: number;
  providerName: string;
  providerCode: string;
  documents: string[];
};

type Folder = {
  folderName: string;
  BatchNumber: string;
  email: string;
  claims: Claim[];
};

const data = [
  {
    folderName: 'Batch 1',
    BatchNumber: '123455',
    email: "ken99@yahoo.com",

    claims: [
      {
        id: 1,
        providerName: 'Provider A',
        providerCode: '1234',
        

        documents: ['Document 1', 'Document 2', 'Document 3']
      },
      {
        id: 2,
        providerName: 'Provider B',
        providerCode: '1234',

        documents: ['Document 4', 'Document 5', 'Document 6']
      }
    ]
  },
  {
    folderName: 'Batch 2',
    BatchNumber: '123455',
    email: "ken99@yahoo.com",

    claims: [
      {
        id: 3,
        providerCode: '1234',
        providerName: 'Provider C',
        documents: ['Document 7', 'Document 8', 'Document 9']
      }
    ]
  }
];

export default function BatchClaims() {
  const router = useRouter(); // Instantiate the useRouter hook

  const [selectedBatch, setSelectedBatch] = React.useState<Folder | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: (ColumnDef<Folder> | ColumnDef<Claim>)[] = selectedBatch ? [
    // Claims columns
    {
      accessorFn: (row: Claim) => row.providerName,
      id: 'providerName',
      header: 'Provider Name',
      cell: info => info.getValue(),
    },
    {
      accessorFn: (row: Claim) => row.providerCode,
      id: 'providerCode',
      header: 'Provider Code',
      cell: info => info.getValue(),
    },
    {
      accessorFn: (row: Claim) => row.documents.join(', '),
      id: 'documents',
      header: 'Documents',
      cell: info => info.getValue(),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const claimID = row.original.id
        console.log("claimID", claimID)
  
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
              onClick={() => {
                router.push(`/dashboard/client/claim/${row.original.id}`);
              }}
            >
                View Claim
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ] : [
    // Batches columns
    {
      accessorKey: 'folderName',
      header: 'Batch Name',
      cell: info => <div className="capitalize">{info.getValue()}</div>,
    },
    {
      accessorKey: 'BatchNumber',
      header: 'Batch Number',
      cell: info => <div className="capitalize">{info.getValue()}</div>,
    },
    {
      accessorKey: 'email',
      header: () => <div>Uploaded By</div>,
      cell: info => <div className="lowercase">{info.getValue()}</div>,
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => { setSelectedBatch(row.original); navigator.clipboard.writeText(row.original.BatchNumber);  }}>
              View Batch
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Warnings</DropdownMenuItem>
            <DropdownMenuItem>Audit Trail</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const tableInstance = useReactTable({
    data: selectedBatch ? selectedBatch.claims : data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={tableInstance.getColumn('email')?.getFilterValue() ?? ""}
          onChange={(event) =>
            tableInstance.getColumn('email')?.setFilterValue(event.target.value)
          }
          className="max-w-xs mr-4"
        />
        <div style={{ paddingRight: '20px' }}>
          <DateRangePicker1 />
        </div>
        <div style={{ paddingRight: '20px' }}>
          <Status />
        </div>
        <div style={{ paddingRight: '20px' }}>
          <Export1 />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {tableInstance
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {tableInstance.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {tableInstance.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedBatch && (
          <Button size="sm" className="gap-1" onClick={() => setSelectedBatch(null)}>Back to All Batches</Button>
      )}

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {tableInstance.getFilteredSelectedRowModel().rows.length} of
          {tableInstance.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => tableInstance.previousPage()}
            disabled={!tableInstance.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => tableInstance.nextPage()}
            disabled={!tableInstance.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

