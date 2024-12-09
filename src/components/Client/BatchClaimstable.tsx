"use client";

import * as React from "react";
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
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { axios } from "@/utils/axios";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DateRangePicker1 from "@/components/DateRangePicker";
import Status from "@/components/Status/Status";
import Export1 from "@/components/Export";

type Claim = {
  id: string;
  claimNumber: string;
  providerName: string;
  providerCode: string;
  documents: string[];
  status: string;
  createdBy: string;
  email: string;
  date: string;
};

type Batch = {
  id: string;
  batchNumber: string;
  providerName: string;
  providerCode: string;
  claims: Claim[];
  createdBy: string;
  email: string;
  createdAt: string;
};

export default function BatchClaims() {
  const router = useRouter();
  const [batches, setBatches] = React.useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = React.useState<Batch | null>(null);
  const [claims, setClaims] = React.useState<Claim[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [loading, setLoading] = React.useState<boolean>(true);

  const fetchUserData = async (userId: string) => {
    try {
      const response = await axios.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      return null;
    }
  };

  const fetchClaimDetails = async (claimId: string) => {
    try {
      const response = await axios.get(`/clients/claims/${claimId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch claim details:", error);
      return null;
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await axios.get("/clients/batches");
      const batchesData = await Promise.all(response.data.map(async (batch: any) => {
        const claimsWithUserDetails = await Promise.all(batch.claims.map(async (claim: any) => {
          const user = await fetchUserData(claim.submittedBy);
          return {
            id: claim._id,
            claimNumber: claim.claimNumber,
            providerName: claim.providerName,
            providerCode: claim.providerCode,
            documents: claim.documents,
            status: claim.status,
            createdBy: user ? user.name : claim.submittedBy,
            email: user ? user.email : "N/A",
            date: claim.createdAt,
          };
        }));

        return {
          id: batch._id,
          batchNumber: batch.batchNumber,
          providerName: batch.providerName,
          providerCode: batch.providerCode,
          claims: claimsWithUserDetails,
          createdBy: batch.createdBy,
          email: "example@example.com", // Placeholder email, replace with actual email if available
          createdAt: batch.createdAt,
        };
      }));
      setBatches(batchesData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch batches:", error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatchById = async (batchId: string) => {
    try {
      const response = await axios.get(`/clients/batches/${batchId}`);
      const batch = response.data;
      const claimsWithUserDetails = await Promise.all(batch.claims.map(async (claim: any) => {
        const claimDetails = await fetchClaimDetails(claim);
        const user = await fetchUserData(claimDetails.submittedBy);
        return {
          id: claimDetails._id,
          claimNumber: claimDetails.claimNumber,
          providerName: claimDetails.providerName,
          providerCode: claimDetails.providerCode,
          documents: claimDetails.documents,
          status: claimDetails.status,
          createdBy: user ? user.name : claimDetails.submittedBy,
          email: user ? user.email : "N/A",
          date: claimDetails.createdAt,
        };
      }));

      setSelectedBatch({
        id: batch._id,
        batchNumber: batch.batchNumber,
        providerName: batch.providerName,
        providerCode: batch.providerCode,
        claims: claimsWithUserDetails,
        createdBy: batch.createdBy,
        email: "example@example.com", // Placeholder email, replace with actual email if available
        createdAt: batch.createdAt,
      });
      setClaims(claimsWithUserDetails);
    } catch (error) {
      console.error("Failed to fetch batch by id:", error);
    }
  };

  const columns: ColumnDef<Batch | Claim>[] = selectedBatch ? [
    // Claims columns
    {
      accessorFn: (row: Claim) => row.claimNumber,
      id: 'claimNumber',
      header: 'Claim Number',
      cell: info => info.getValue(),
    },
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
      accessorFn: (row: Claim) => row.status,
      id: 'status',
      header: 'Status',
      cell: info => info.getValue(),
    },
    {
      accessorFn: (row: Claim) => row.createdBy,
      id: 'createdBy',
      header: 'Created By',
      cell: info => info.getValue(),
    },
    {
      accessorFn: (row: Claim) => row.email,
      id: 'email',
      header: 'Email',
      cell: info => info.getValue(),
    },
    {
      accessorFn: (row: Claim) => row.date,
      id: 'date',
      header: 'Date',
      cell: info => {
        const date = new Date(info.getValue());
        const formatted = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const claimID = row.original.id;
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
                onClick={() => router.push(`/dashboard/client/claim/${claimID}`)}
              >
                View Claim
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ] : [
    // Batches columns
    {
      accessorKey: 'batchNumber',
      header: 'Batch Number',
      cell: info => <div className="capitalize">{info.getValue()}</div>,
    },
    {
      accessorKey: 'providerName',
      header: 'Provider Name',
      cell: info => <div className="capitalize">{info.getValue()}</div>,
    },
    {
      accessorKey: 'email',
      header: () => <div>Uploaded By</div>,
      cell: info => <div className="lowercase">{info.getValue()}</div>,
    },
    {
      accessorKey: 'createdAt',
      header: () => <div>Date</div>,
      cell: info => {
        const dateString = info.getValue() as string;
        const date = new Date(dateString);
        const formatted = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const batchID = row.original.id;
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
                onClick={() => fetchBatchById(batchID)}
              >
                View Claims
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/client/batch/${batchID}`)}
              >
                View Batch
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const tableInstance = useReactTable({
    data: selectedBatch ? claims : batches,
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

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render main component
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter claims or batches..."
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
          <Status label="Status" placeholder="Select Status" />
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
              .map((column) => (
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
              ))}
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
        <Button size="sm" className="gap-1" onClick={() => setSelectedBatch(null)}>
          Back to All Batches
        </Button>
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
