"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { axios } from "@/utils/axios";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import DateRangePicker1 from "@/components/DateRangePicker";
import Status from "@/components/Status/Status";
import Export1 from "@/components/Export";
import Papa from "papaparse";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

type Batch = {
  _id: string;
  batchNumber: string;
  providerName: string;
  providerCode: string;
  startDate: string;
  endDate: string;
  status: string;
  claims: string[];
};

type Claim = {
  _id: string;
  claimNumber: string;
  providerName: string;
  amount: string;
  invoiceDate: string;
  barcode: string;
  clientName: string;
  status: string;
};

type Provider = {
  name: string;
  code: string;
  batches: Batch[];
};

export default function BatchClaims() {
  const router = useRouter();
  const [providers, setProviders] = React.useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = React.useState<Provider[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [filterText, setFilterText] = React.useState<string>("");
  const [claimsByBatch, setClaimsByBatch] = React.useState<{ [key: string]: Claim[] }>({});

  const fetchBatches = async () => {
    try {
      const response = await axios.get("/clients/batches");
      const batchData = response.data.data;

      // Group batches by provider
      const providerMap: { [key: string]: Provider } = {};
      batchData.forEach((batch: Batch) => {
        if (!providerMap[batch.providerCode]) {
          providerMap[batch.providerCode] = {
            name: batch.providerName,
            code: batch.providerCode,
            batches: [],
          };
        }
        providerMap[batch.providerCode].batches.push(batch);
      });

      const providerList = Object.values(providerMap);

      setProviders(providerList);
      setFilteredProviders(providerList);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch providers:", error);
      setLoading(false);
    }
  };

  const fetchClaims = async (batchID: string) => {
    try {
      const response = await axios.get(`/clients/batches/${batchID}`);
      const batch = response.data.batch;
      const claims = await Promise.all(
        batch.claims.map((claimID: string) => axios.get(`/clients/claims/${claimID}`).then(res => res.data.claim))
      );

      setClaimsByBatch(prev => ({ ...prev, [batchID]: claims }));
    } catch (error) {
      console.error("Failed to fetch claims:", error);
    }
  };

  React.useEffect(() => {
    fetchBatches();
  }, []);

  const handleDateRangeFilter = async (startDate: Date, endDate: Date) => {
    try {
      const response = await axios.get(`/admin/filter-batches-by-date`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });

      setFilteredProviders(response.data.data);
    } catch (error) {
      console.error("Failed to filter batches by date:", error);
    }
  };

  const handleTextFilter = (text: string) => {
    setFilterText(text);
    const filtered = providers.filter(provider =>
      provider.name.toLowerCase().includes(text.toLowerCase()) ||
      provider.code.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProviders(filtered);
  };

  const handleViewBatch = async (batchID: string) => {
    try {
      await axios.get(`/clients/batches/${batchID}`);
      router.push(`/dashboard/admin/batch/${batchID}`);
    } catch (error) {
      console.error("Failed to lock and view batch:", error);
    }
  };

  const handleExportCSV = async () => {
    const csvData: Array<{ [key: string]: string }> = [];
  
    for (const provider of filteredProviders) {
      csvData.push({
        Provider: provider.name,
        Batches: "",
        Claims: "",
        ClaimProviderName: "",
        Amount: "",
        InvoiceDate: "",
        Barcode: "",
        ClientName: "",
        ClaimStatus: ""
      });
  
      for (const batch of provider.batches) {
        csvData.push({
          Provider: "",
          Batches: batch.batchNumber,
          Claims: "",
          ClaimProviderName: "",
          Amount: "",
          InvoiceDate: "",
          Barcode: "",
          ClientName: "",
          ClaimStatus: ""
        });
  
        try {
          const response = await axios.get(`/clients/batches/${batch._id}`);
          const batchData = response.data.batch;
          const claims = await Promise.all(
            batchData.claims.map((claimID: string) => axios.get(`/clients/claims/${claimID}`).then(res => res.data.claim))
          );
  
          claims.forEach(claim => {
            csvData.push({
              Provider: "",
              Batches: "",
              Claims: claim.claimNumber,
              ClaimProviderName: claim.providerName,
              Amount: claim.amount,
              InvoiceDate: claim.invoiceDate,
              Barcode: claim.barcode,
              ClientName: claim.clientName,
              ClaimStatus: claim.status
            });
          });
        } catch (error) {
          console.error("Failed to fetch claims:", error);
        }
      }
    }
  
    const csv = Papa.unparse(csvData, {
      header: true,
      columns: [
        "Provider",
        "Batches",
        "Claims",
        "ClaimProviderName",
        "Amount",
        "InvoiceDate",
        "Barcode",
        "ClientName",
        "ClaimStatus"
      ]
    });
  
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "batches.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  

  const handleBatchAccordionChange = (batchID: string, isOpen: boolean) => {
    console.log("batchID", batchID)
    if (isOpen && !claimsByBatch[batchID]) {
      fetchClaims(batchID);
    }
  };
  const columns: ColumnDef<Batch>[] = [
    {
      accessorKey: 'batchNumber',
      header: 'Batch Number',
      cell: ({ row }) => {
        const value = row.original?.batchNumber;
        return <div className="capitalize">{value || 'N/A'}</div>;
      },
    },
    {
      accessorKey: 'providerName',
      header: 'Provider Name',
      cell: ({ row }) => {
        const value = row.original?.providerName;
        return <div>{value || 'N/A'}</div>;
      },
    },
    {
      accessorKey: 'providerCode',
      header: 'Provider Code',
      cell: ({ row }) => {
        const value = row.original?.providerCode;
        return <div>{value || 'N/A'}</div>;
      },
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => {
        const value = row.original?.startDate;
        if (!value) return <div>N/A</div>;
        const date = new Date(value);
        const formatted = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: 'endDate',
      header: 'End Date',
      cell: ({ row }) => {
        const value = row.original?.endDate;
        if (!value) return <div>N/A</div>;
        const date = new Date(value);
        const formatted = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const value = row.original?.status;
        return <div className="capitalize">{value || 'N/A'}</div>;
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
                onClick={() => handleViewBatch(row.original?._id)}
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

  const claimColumns: ColumnDef<Claim>[] = [
    {
      accessorKey: 'claimNumber',
      header: 'Claim Number',
      cell: ({ row }) => {
        const value = row.original?.claimNumber;
        return <div>{value || 'N/A'}</div>;
      },
    },
    {
      accessorKey: 'providerName',
      header: 'Provider Name',
      cell: ({ row }) => {
        const value = row.original?.providerName;
        return <div>{value || 'N/A'}</div>;
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        const value = row.original?.amount;
        return <div>{value || 'N/A'}</div>;
      },
    },
    {
      accessorKey: 'invoiceDate',
      header: 'Invoice Date',
      cell: ({ row }) => {
        const value = row.original?.invoiceDate;
        if (!value) return <div>N/A</div>;
        const date = new Date(value);
        const formatted = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: 'barcode',
      header: 'Barcode',
      cell: ({ row }) => {
        const value = row.original?.barcode;
        return <div>{value || 'N/A'}</div>;
      },
    },
    {
      accessorKey: 'clientName',
      header: 'Client Name',
      cell: ({ row }) => {
        const value = row.original?.clientName;
        return <div>{value || 'N/A'}</div>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const value = row.original?.status;
        return <div className="capitalize">{value || 'N/A'}</div>;
      },
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <DateRangePicker1 onDateRangeSelected={handleDateRangeFilter} />
        <input
          type="text"
          placeholder="Filter by provider name or code"
          value={filterText}
          onChange={(e) => handleTextFilter(e.target.value)}
          className="ml-4 px-4 py-2 border rounded"
        />
        <div style={{ paddingRight: '20px' }}>
          <Status label="Status" placeholder="Select Status" />
        </div>
        <div style={{ paddingRight: '20px' }}>
          <Export1 />
        </div>
        <Button onClick={handleExportCSV}>Export to CSV</Button>
      </div>

      <Accordion type="single" collapsible>
  {filteredProviders.map(provider => (
    <AccordionItem key={provider.code} value={provider.code}>
      <AccordionTrigger>
        <div className="flex justify-between w-full px-4 py-2 text-left">
          <span>{provider.name}</span>
          <span>{provider.code}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead key={column.accessorKey as string}>
                  {flexRender(column.header, {})}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {provider.batches.map(batch => (
              <React.Fragment key={batch.id}>
                <TableRow>
                  {columns.map(column => (
                    <TableCell key={column.id as string}>
                      {column.cell ? column.cell({ row: { original: batch } }) : null}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={batch._id}>
                        <AccordionTrigger className="py-2"         onClick={() => handleBatchAccordionChange(batch._id, true)}
>
                          View Claims
                        </AccordionTrigger>
                        <AccordionContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {claimColumns.map(column => (
                                  <TableHead key={column.accessorKey as string}>
                                    {flexRender(column.header, {})}
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {claimsByBatch[batch._id]?.map(claim => (
                                <TableRow key={claim._id}>
                                  {claimColumns.map(column => (
                                    <TableCell key={column.id as string}>
                                      {column.cell ? column.cell({ row: { original: claim } }) : null}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
    </div>
  );
}
