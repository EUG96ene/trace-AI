"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./ClaimPreviewLoader";
import { axios } from "@/utils/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  PdfViewerComponent,
  Toolbar,
  Magnification,
  Navigation,
  Annotation,
  LinkAnnotation,
  BookmarkView,
  ThumbnailView,
  Print,
  TextSelection,
  TextSearch,
  FormFields,
  FormDesigner,
  Inject,
} from "@syncfusion/ej2-react-pdfviewer";
import { registerLicense } from "@syncfusion/ej2-base";
import { Toaster } from "react-hot-toast";

interface ClaimData {
  providerNumber: string;
  providerCode: string;
  amount: string;
  invoiceDate: string;
  barcode: string;
  clientName: string;
  claimNumber: string;
  documents: DocumentData[];
  _id: string;
  status: string;
}

interface DocumentData {
  url: string;
  claimNumber: string;
}

interface FormValues {
  invoiceNumber: string;
  providerNumber: string;
  providerCode: string;
  amount: string;
  invoiceDate: string;
  barcode: string;
  clientName: string;
  providerName: string;
  _id?: string;
}

export default function ClaimDetails() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [claimData, setClaimData] = useState<ClaimData | null>(null);
  const [documentData, setDocumentData] = useState<DocumentData[]>([]);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingClaim, setEditingClaim] = useState<ClaimData | null>(null);
  const [formValues, setFormValues] = useState<FormValues | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No claim ID provided.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const claimResponse = await axios.get(`/clients/claims/${id}`);
        setClaimData(claimResponse.data.claim);

        if (claimResponse.data.claim.documents.length > 0) {
          const documentId = claimResponse.data.claim.documents[0]; // Get the first document ID
          const documentResponse = await axios.get(
            `/claims/documents/${documentId._id}`
          );
          setDocumentData([documentResponse.data.document]); // Store the retrieved document
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch claim data:", error);
        setError("Failed to fetch claim data.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleFileSelect = (file: { preview: string }) => {
    setSelectedFile(file.preview);
  };

  const handleApprove = async () => {
    try {
      await axios.put(`/admin/claims/${id}/approve`);
      toast.success("Claim subnitted Successfully");
      setTimeout(() => {
        router.push("/dashboard/admin/claim-approvals");
      }, 3000);
    } catch (error) {
      toast.warn("An error occurred.", error);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/admin/claim-approvals");
  };

  const handleViewFile = (url: string) => {
    setSelectedFile(`http://localhost:7000${url}`);
  };

  const handleEditClaim = () => {
    setFormValues({
      invoiceNumber: "",
      providerNumber: "",
      providerCode: claimData?.providerCode || "",
      amount: claimData?.amount || "",
      invoiceDate: claimData?.invoiceDate || "",
      barcode: claimData?.barcode || "",
      clientName: claimData?.clientName || "",
      providerName: claimData?.providerName || "",
      _id: claimData?._id,
    });
    setEditingClaim(claimData);
  };

  const handleSaveClaim = async () => {
    if (editingClaim && formValues) {
      try {
        const updatedClaim = { ...editingClaim, ...formValues };
        await axios.put(`/admin/claims/${id}`, updatedClaim);
        setClaimData(updatedClaim);
        setEditingClaim(null);
        toast.success("Claim updated successfully");
      } catch (error) {
        toast.error("Failed to update claim");
      }
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (formValues) {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        [name]: value,
      }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (formValues) {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        invoiceDate: date ? date.toISOString() : "",
      }));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Toaster />

      <div className="flex min-h-screen w-full flex-col bg-white/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <div className="flex between gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() =>
                    router.push("/dashboard/admin/claim-approvals")
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Claim Information
                </h1>
                <Badge variant="outline" className="ml-auto sm:ml-0">
                  {claimData?.status}
                </Badge>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  <Button size="sm" onClick={handleApprove}>
                    Approve
                  </Button>

                  <Button size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>{claimData?.claimNumber}</CardTitle>
                      <CardDescription>
                        Details about this Claim
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="providerCode">Provider Code</Label>
                          <Input
                            id="providerCode"
                            type="text"
                            className="w-full"
                            value={claimData?.providerCode}
                            readOnly
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="providerName">Provider Name</Label>
                          <Input
                            id="providerName"
                            type="text"
                            className="w-full"
                            value={claimData?.providerName}
                            readOnly
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="amount">Amount</Label>
                          <Input
                            id="amount"
                            type="text"
                            className="w-full"
                            value={claimData?.amount}
                            readOnly
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {claimData && (
                    <Card className="overflow-hidden">
                      <CardHeader>
                        <CardTitle>Attachments</CardTitle>
                        <CardDescription>
                          Accompanying documents
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Loader
                          onFileSelect={handleFileSelect}
                          initialFiles={documentData.map((doc) => ({
                            preview: `/uploads/${doc.url}`,
                            name: doc.claimNumber,
                            size: 0,
                          }))}
                          onViewFile={handleViewFile}
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>
                <div className="grid auto-rows-max items-start w-[80vh] gap-4 lg:gap-8">
                  {selectedFile && (
                    <div className="control-section">
                      <PdfViewerComponent
                        id="container"
                        documentPath={selectedFile}
                        serviceUrl="https://services.syncfusion.com/react/production/api/pdfviewer"
                        style={{ height: "640px" }}
                      >
                        <Inject
                          services={[
                            Toolbar,
                            Magnification,
                            Navigation,
                            Annotation,
                            LinkAnnotation,
                            BookmarkView,
                            ThumbnailView,
                            Print,
                            TextSelection,
                            TextSearch,
                            FormFields,
                            FormDesigner,
                          ]}
                        />
                      </PdfViewerComponent>
                    </div>
                  )}
                </div>
              </div>
              {claimData && (
                <Dialog
                  open={editingClaim !== null}
                  onOpenChange={() => setEditingClaim(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleEditClaim}
                    >
                      Edit Claim
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <Card>
                      <CardHeader>
                        <CardTitle>Edit Claim Details</CardTitle>
                        <CardDescription>
                          Enter the claim details below
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6">
                          <div className="grid gap-3">
                            <Label htmlFor="invoiceNumber">
                              Invoice Number
                            </Label>
                            <Input
                              id="invoiceNumber"
                              name="invoiceNumber"
                              type="text"
                              className="w-full"
                              value={formValues?.invoiceNumber || ""}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="providerName">Provider Name</Label>
                            <Input
                              id="providerName"
                              name="providerName"
                              type="text"
                              className="w-full"
                              value={formValues?.providerName || ""}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="providerCode">Provider Code</Label>
                            <Input
                              id="providerCode"
                              name="providerCode"
                              type="text"
                              className="w-full"
                              value={formValues?.providerCode || ""}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                              id="amount"
                              name="amount"
                              type="text"
                              className="w-full"
                              value={formValues?.amount || ""}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="invoiceDate">Invoice Date</Label>
                            <DatePicker
                              selected={
                                formValues?.invoiceDate
                                  ? new Date(formValues?.invoiceDate)
                                  : null
                              }
                              onChange={handleDateChange}
                              customInput={<Input />}
                              dateFormat="yyyy/MM/dd"
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="barcode">Barcode</Label>
                            <Input
                              id="barcode"
                              name="barcode"
                              type="text"
                              className="w-full"
                              value={formValues?.barcode || ""}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="clientName">Client Name</Label>
                            <Input
                              id="clientName"
                              name="clientName"
                              type="text"
                              className="w-full"
                              value={formValues?.clientName || ""}
                              onChange={handleChange}
                            />
                          </div>
                          <Button size="sm" onClick={handleSaveClaim}>
                            Save
                          </Button>
                          <DialogClose asChild>
                            <Button
                              size="sm"
                              onClick={() => setEditingClaim(null)}
                            >
                              Cancel
                            </Button>
                          </DialogClose>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
