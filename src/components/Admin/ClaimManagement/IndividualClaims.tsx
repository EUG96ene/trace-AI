// IndividualClaim.tsx

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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import {axios} from "@/utils/axios";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import Export1 from "@/components/Export";

export type Claim = {
  id: string;
  date: string;
  status: "approved" | "Returned" | "Rejected" | "submitted";
  email: string;
  createdBy: string;
  providerName: string;
  providerCode: string;
  claimNumber: string
};

const IndividualClaim = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<Claim[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const router = useRouter();

    // Fetch user data based on userId
    const fetchUserData = async (userId: string) => {
      try {
        const response = await axios.get(`/users/${userId}`);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        return null;
      }
    };
  
    // Transform claims data by adding user information
    const transformData = async (claims: any[]) => {
      return await Promise.all(
        claims.map(async (claim) => {
          const user = await fetchUserData(claim.submittedBy);
          return {
            id: claim._id,
            date: claim.createdAt,
            status: claim.status,
            email: user ? user.email : "N/A",
            createdBy: user ? user.name : claim.submittedBy,
            providerName: claim.providerName,
            providerCode: claim.providerCode,
            claimNumber: claim.claimNumber,
          };
        })
      );
    };
  
    // Fetch claims and transform data
    React.useEffect(() => {
      const fetchClaims = async () => {
        try {
          const response = await axios.get("/clients/claims");
          const filteredClaims = response.data.data.filter(
            (claim) => claim.status === "pending" || claim.status === "Returned"
          );
          const transformedData = await transformData(filteredClaims);
          setData(transformedData);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch claims:", error);
          setLoading(false);
        }
      };
  
      fetchClaims();
    }, []);
  // Define columns for the table
  const columns: ColumnDef<Claim>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "claimNumber",
      header: "Claim Number",
      cell: ({ row }) => <div className="capitalize">{row.getValue("claimNumber")}</div>,
    },
    {
      accessorKey: "createdBy",
      header: "Created By",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("createdBy")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Upload By
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "providerName",
      header: "Provider Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("providerName")}</div>
      ),
    },
    {
      accessorKey: "providerCode",
      header: "Provider Code",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("providerCode")}</div>
      ),
    },
    {
      accessorKey: "date",
      header: () => <div className="text-right">Date</div>,
      cell: ({ row }) => {
        const dateString = row.getValue("date");
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
                onClick={() => router.push(`/dashboard/client/claim/${row.original.id}`)}
                >
                View Claim
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Add more actions here as needed */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Set up table instance
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
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
          placeholder="Filter claims ..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-xs mr-4"
        />
        <div style={{ paddingRight: "20px" }}>
          <DateRangePicker1 />
        </div>
        <div style={{ paddingRight: "20px" }}>
          <Export1 />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
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
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IndividualClaim;
