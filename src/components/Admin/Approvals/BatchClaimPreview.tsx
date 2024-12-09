import React, { useEffect, useState, ChangeEvent } from "react";
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
import { toast, Toaster } from "react-hot-toast";
import { FileUploader } from "@/components/Admin/Approvals/BatchClaimsLoader";
import { axios } from "@/utils/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getSession } from "next-auth/react";
import PDFViewer from "./DocumentViewer";

export default function BatchClaimPreview() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  interface BatchData {
    batchNumber: string;
    providerCode: string;
    providerName: string;
    status: string;
    claims: string[];
  }

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

  const [batchData, setBatchData] = useState<BatchData | null>(null);
  const [claimsData, setClaimsData] = useState<ClaimData[]>([]);
  const [documentsData, setDocumentsData] = useState<DocumentData[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingClaimIndex, setEditingClaimIndex] = useState<number | null>(
    null
  );
  const [formValues, setFormValues] = useState<FormValues[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [newClaims, setNewClaims] = useState<ClaimData[]>([]);
  const [showDocumentView, setShowDocumentView] = useState<Boolean>(false);

  const handleChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prevFormValues) => {
      const updatedFormValues = [...prevFormValues];
      updatedFormValues[index] = {
        ...updatedFormValues[index],
        [name]: value,
      };
      return updatedFormValues;
    });
  };

  const handleFieldChange = (field: string, value: string) => {
    if (editingClaimIndex !== null) {
      setFormValues((prevFormValues) => {
        const updatedFormValues = [...prevFormValues];
        updatedFormValues[editingClaimIndex] = {
          ...updatedFormValues[editingClaimIndex],
          [field]: value,
        };
        return updatedFormValues;
      });
    }
  };

  useEffect(() => {
    if (!id) {
      setError("No batch ID provided.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const batchResponse = await axios.get(`/clients/batches/${id}`);
        console.log("batchResponse", batchResponse)

        const batch = batchResponse.data.batch;
console.log("batch", batch)
        const claims = await Promise.all(
          batch.claims.map(async (claimID: string) => {
            
            const claimResponse = await axios.get(`/clients/claims/${claimID}`);
            console.log("claimResponse", claimResponse)
            return claimResponse.data.claim;
          })
        );
        console.log("claims", claims)

        setBatchData(batch);
        setClaimsData(claims);

        const allDocuments = await Promise.all(
          claims.flatMap(
            async (claim) =>
              await Promise.all(
                claim.documents.map(async (documentRef) => {
                  try {
                    const response = await axios.get(
                      `/claims/documents/${documentRef._id}`
                    );
                    const fullDocument = response.data.document;
                    return {
                      url: fullDocument ? fullDocument.url : null,
                      claimNumber: claim.claimNumber,
                    };
                  } catch (error) {
                    console.error(
                      `Error fetching document ${documentRef._id}:`,
                      error
                    );
                    return {
                      url: null,
                      claimNumber: claim.claimNumber,
                    };
                  }
                })
              )
          )
        );
        console.log(allDocuments);
        setDocumentsData(allDocuments);

        setFormValues(
          claims.map((claim) => ({
            invoiceNumber: "",
            providerNumber: "",
            providerCode: batch.providerCode, // Prepopulate providerCode
            amount: "",
            invoiceDate: "",
            barcode: "",
            clientName: "",
            providerName: batch.providerName, // Prepopulate providerName
            _id: claim._id,
          }))
        );

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch batch data:", error);
        setError("Failed to fetch batch data.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleFileSelect = (file: { preview: string }) => {
    setSelectedFile(file.preview);
  };

  const handleCancel = async () => {
    try {
      router.push("/dashboard/admin/claim-approvals");
    } catch (error) {
      toast.error("An error occurred.", error);
    }
  };

  const handleSplit = (url: string) => {
    setSelectedFile(url.startsWith("/") ? `http://localhost:7000${url}` : url);
    setShowDocumentView(true);
  };

  const handlePreviewViewFile = (url: string) => {
    setSelectedFile(url.startsWith("/") ? `http://localhost:7000${url}` : url);
  };

  const handleEditClaim = (index: number) => {
    setEditingClaimIndex(index);
  };
  const handleSaveClaim = async () => {
    if (editingClaimIndex === null) return;
  
    const updatedClaims = [...claimsData];
    const updatedClaim = {
      ...updatedClaims[editingClaimIndex],
      ...formValues[editingClaimIndex],
    };
  
    updatedClaims[editingClaimIndex] = updatedClaim;
  
    try {
      const response = await axios.post(`/admin/submit-claims`, {
        batchId: batchData?._id,
        stampedBy: 'Eddie',
        claims: [updatedClaim],
      });  
      if (response.status === 200) {
        setClaimsData(updatedClaims);
        setEditingClaimIndex(null);
        toast.success("Claim updated successfully");
      } else {
        toast.error("Failed to update claim");
      }
    } catch (error) {
      toast.error("Error updating claim: " + error.message);
    }
  };
  

  const handleCancelEdit = () => {
    setEditingClaimIndex(null);
  };

  const handleSubmit = async () => {
    const session = await getSession();
    const stampedBy = session?.user?.name || "Unknown";

    try {
      const payload = {
        batchId: id,
        stampedBy,
        claims: formValues.map((claim) => ({
          _id: claim._id,
          providerName: claim.providerName,
          providerCode: claim.providerCode,
          amount: claim.amount,
          invoiceDate: claim.invoiceDate,
          barcode: claim.barcode,
          clientName: claim.clientName,
        })),
      };

      await axios.post("/admin/submit-claims", payload);
      toast.success("Data submitted successfully");
      setTimeout(() => {
        router.push("/dashboard/admin/claim-approvals");
      }, 3000);
    } catch (error) {
      toast.error("Failed to submit data");
    }
  };

  const handleLookupSubmit = async (index: number) => {
    try {
      const response = await axios.post("/admin/lookup-claim-data", {
        invoiceNumber: formValues[index].invoiceNumber,
        batchNumber: batchData?.batchNumber,
      });

      const claimData = response.data;

      setFormValues((prevFormValues) => {
        const updatedFormValues = [...prevFormValues];
        updatedFormValues[index] = {
          ...updatedFormValues[index],
          providerCode: claimData.providerCode,
          providerName: claimData.providerName,
          amount: claimData.amount,
        };
        return updatedFormValues;
      });

      toast.success("Lookup successful");
    } catch (error) {
      toast.error("Failed to lookup claim data");
    }
  };

  const handleDateChange = (index: number, date: Date | null) => {
    setFormValues((prevFormValues) => {
      const updatedFormValues = [...prevFormValues];
      updatedFormValues[index] = {
        ...updatedFormValues[index],
        invoiceDate: date ? date.toISOString() : "",
      };
      return updatedFormValues;
    });
  };

  const handleSelectPage = (pageNumber: number) => {
    setSelectedPages((prev) => [...prev, pageNumber]);
    toast.success(`Page ${pageNumber} selected for splitting.`);
  };

  const handleSplitDocument = async () => {
    try {
      const response = await axios.post("/admin/split-document", {
        documentUrl: selectedFile,
        selectedPages,
      });

      const newClaims = response.data;
      setNewClaims((prev) => [...prev, ...newClaims]);
      toast.success("Document split successfully.");
    } catch (error) {
      toast.error("Failed to split document.");
    }
  };

  const initialFiles = documentsData.map((document) => ({
    preview: document.url?.startsWith("/") ? document.url : `/${document.url}`,
    name: document.claimNumber,
    size: 0,
  }));

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
              {showDocumentView ? (
                <div className="control-section w-full h-full">
                  <PDFViewer
                    documentUrl={selectedFile}
                    batchNumber={id}
                    showDocumentView={setShowDocumentView}
                    fields={editingClaimIndex !== null ? formValues[editingClaimIndex] : {}}
                    onFieldChange={handleFieldChange}
                  />
                </div>
              ) : (
                <>
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
                      Batch Claim Information
                    </h1>
                    <Badge variant="outline" className="ml-auto sm:ml-0">
                      {batchData?.status}
                    </Badge>
                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                      <Button size="sm" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSubmit}>
                        Submit
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                      <Card>
                        <CardHeader>
                          <CardTitle>{batchData?.batchNumber}</CardTitle>
                          <CardDescription>
                            Details about this Batch
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-6">
                            <div className="grid gap-3">
                              <Label htmlFor="invoiceNumber">Invoice Number</Label>
                              <Input
                                id="invoiceNumber"
                                name="invoiceNumber"
                                type="text"
                                className="w-full"
                                value={formValues[0]?.invoiceNumber || ""}
                                onChange={(e) => handleChange(0, e)}
                              />
                              <Button
                                size="sm"
                                onClick={() => handleLookupSubmit(0)}
                              >
                                Lookup Claim Data
                              </Button>
                            </div>
                            <div className="grid gap-3">
                              <Label htmlFor="providerCode">Provider Code</Label>
                              <Input
                                id="providerCode"
                                type="text"
                                className="w-full"
                                value={formValues[0]?.providerCode || ""}
                                readOnly
                              />
                            </div>
                            <div className="grid gap-3">
                              <Label htmlFor="providerName">Provider Name</Label>
                              <Input
                                id="providerName"
                                type="text"
                                className="w-full"
                                value={formValues[0]?.providerName || ""}
                                readOnly
                              />
                            </div>
                            <div className="grid gap-3">
                              <Label htmlFor="amount">Amount</Label>
                              <Input
                                id="amount"
                                type="text"
                                className="w-full"
                                value={formValues[0]?.amount || ""}
                                readOnly
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      {editingClaimIndex !== null && (
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
                                <Label
                                  htmlFor={`invoiceNumber-${editingClaimIndex}`}
                                >
                                  Invoice Number
                                </Label>
                                <Input
                                  id={`invoiceNumber-${editingClaimIndex}`}
                                  name="invoiceNumber"
                                  type="text"
                                  className="w-full"
                                  value={
                                    formValues[editingClaimIndex]?.invoiceNumber
                                  }
                                  onChange={(e) =>
                                    handleChange(editingClaimIndex, e)
                                  }
                                />
                              </div>
                              <div className="grid gap-3">
                                <Label
                                  htmlFor={`providerName-${editingClaimIndex}`}
                                >
                                  Provider Name
                                </Label>
                                <Input
                                  id={`providerName-${editingClaimIndex}`}
                                  name="providerName"
                                  type="text"
                                  className="w-full"
                                  value={
                                    formValues[editingClaimIndex]?.providerName
                                  }
                                  onChange={(e) =>
                                    handleChange(editingClaimIndex, e)
                                  }
                                />
                              </div>
                              <div className="grid gap-3">
                                <Label
                                  htmlFor={`providerCode-${editingClaimIndex}`}
                                >
                                  Provider Code
                                </Label>
                                <Input
                                  id={`providerCode-${editingClaimIndex}`}
                                  name="providerCode"
                                  type="text"
                                  className="w-full"
                                  value={
                                    formValues[editingClaimIndex]?.providerCode
                                  }
                                  onChange={(e) =>
                                    handleChange(editingClaimIndex, e)
                                  }
                                />
                              </div>
                              <div className="grid gap-3">
                                <Label htmlFor={`amount-${editingClaimIndex}`}>
                                  Amount
                                </Label>
                                <Input
                                  id={`amount-${editingClaimIndex}`}
                                  name="amount"
                                  type="text"
                                  className="w-full"
                                  value={formValues[editingClaimIndex]?.amount}
                                  onChange={(e) =>
                                    handleChange(editingClaimIndex, e)
                                  }
                                />
                              </div>
                              <div className="grid gap-3">
                                <Label htmlFor={`invoiceDate-${editingClaimIndex}`}>
                                  Invoice Date
                                </Label>
                                <DatePicker
                                  selected={
                                    formValues[editingClaimIndex]?.invoiceDate
                                      ? new Date(
                                          formValues[editingClaimIndex]?.invoiceDate
                                        )
                                      : null
                                  }
                                  onChange={(date) =>
                                    handleDateChange(editingClaimIndex, date)
                                  }
                                  customInput={<Input />}
                                  dateFormat="yyyy/MM/dd"
                                />
                              </div>
                              <div className="grid gap-3">
                                <Label htmlFor={`barcode-${editingClaimIndex}`}>
                                  Barcode
                                </Label>
                                <Input
                                  id={`barcode-${editingClaimIndex}`}
                                  name="barcode"
                                  type="text"
                                  className="w-full"
                                  value={formValues[editingClaimIndex]?.barcode}
                                  onChange={(e) =>
                                    handleChange(editingClaimIndex, e)
                                  }
                                />
                              </div>
                              <div className="grid gap-3">
                                <Label htmlFor={`clientName-${editingClaimIndex}`}>
                                  Client Name
                                </Label>
                                <Input
                                  id={`clientName-${editingClaimIndex}`}
                                  name="clientName"
                                  type="text"
                                  className="w-full"
                                  value={formValues[editingClaimIndex]?.clientName}
                                  onChange={(e) =>
                                    handleChange(editingClaimIndex, e)
                                  }
                                />
                              </div>
                              <Button size="sm" onClick={handleSaveClaim}>
                                Save
                              </Button>
                              <Button size="sm" onClick={handleCancelEdit}>
                                Cancel
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      <Card className="overflow-hidden">
                        <CardHeader>
                          <CardTitle>Claims</CardTitle>
                          <CardDescription>Accompanying Claims</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <FileUploader
                            onFileSelect={handleFileSelect}
                            initialFiles={documentsData.flat().map((document) => ({
                              preview: document.url?.startsWith("/")
                                ? document.url
                                : `/${document.url}`,
                              name: document.claimNumber,
                              size: 0,
                            }))}
                            onSplitFile={handleSplit}
                            onPreview={handlePreviewViewFile}
                            onEdit={handleEditClaim}
                          />
                        </CardContent>
                      </Card>
                    </div>
                    <div className="grid auto-rows-max items-start w-[80vh] gap-4 lg:gap-8">
                      {newClaims.length > 0 && (
                        <div className="new-claims-section">
                          {newClaims.map((claim, index) => (
                            <Card key={claim._id}>
                              <CardHeader>
                                <CardTitle>New Claim {index + 1}</CardTitle>
                                <CardDescription>
                                  Details for the new claim
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="grid gap-6">
                                  <div className="grid gap-3">
                                    <Label
                                      htmlFor={`new-claim-invoiceNumber-${index}`}
                                    >
                                      Invoice Number
                                    </Label>
                                    <Input
                                      id={`new-claim-invoiceNumber-${index}`}
                                      name="invoiceNumber"
                                      type="text"
                                      className="w-full"
                                      value={claim.invoiceNumber || ""}
                                      onChange={(e) => handleChange(index, e)}
                                    />
                                  </div>
                                  <div className="grid gap-3">
                                    <Label
                                      htmlFor={`new-claim-providerName-${index}`}
                                    >
                                      Provider Name
                                    </Label>
                                    <Input
                                      id={`new-claim-providerName-${index}`}
                                      name="providerName"
                                      type="text"
                                      className="w-full"
                                      value={claim.providerName || ""}
                                      onChange={(e) => handleChange(index, e)}
                                    />
                                  </div>
                                  <div className="grid gap-3">
                                    <Label
                                      htmlFor={`new-claim-providerCode-${index}`}
                                    >
                                      Provider Code
                                    </Label>
                                    <Input
                                      id={`new-claim-providerCode-${index}`}
                                      name="providerCode"
                                      type="text"
                                      className="w-full"
                                      value={claim.providerCode || ""}
                                      onChange={(e) => handleChange(index, e)}
                                    />
                                  </div>
                                  <div className="grid gap-3">
                                    <Label htmlFor={`new-claim-amount-${index}`}>
                                      Amount
                                    </Label>
                                    <Input
                                      id={`new-claim-amount-${index}`}
                                      name="amount"
                                      type="text"
                                      className="w-full"
                                      value={claim.amount || ""}
                                      onChange={(e) => handleChange(index, e)}
                                    />
                                  </div>
                                  <div className="grid gap-3">
                                    <Label
                                      htmlFor={`new-claim-invoiceDate-${index}`}
                                    >
                                      Invoice Date
                                    </Label>
                                    <DatePicker
                                      selected={
                                        claim.invoiceDate
                                          ? new Date(claim.invoiceDate)
                                          : null
                                      }
                                      onChange={(date) =>
                                        handleDateChange(index, date)
                                      }
                                      customInput={<Input />}
                                      dateFormat="yyyy/MM/dd"
                                    />
                                  </div>
                                  <div className="grid gap-3">
                                    <Label htmlFor={`new-claim-barcode-${index}`}>
                                      Barcode
                                    </Label>
                                    <Input
                                      id={`new-claim-barcode-${index}`}
                                      name="barcode"
                                      type="text"
                                      className="w-full"
                                      value={claim.barcode || ""}
                                      onChange={(e) => handleChange(index, e)}
                                    />
                                  </div>
                                  <div className="grid gap-3">
                                    <Label
                                      htmlFor={`new-claim-clientName-${index}`}
                                    >
                                      Client Name
                                    </Label>
                                    <Input
                                      id={`new-claim-clientName-${index}`}
                                      name="clientName"
                                      type="text"
                                      className="w-full"
                                      value={claim.clientName || ""}
                                      onChange={(e) => handleChange(index, e)}
                                    />
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => handleSaveClaim(index)}
                                  >
                                    Save
                                  </Button>
                                  <Button size="sm" onClick={handleCancelEdit}>
                                    Cancel
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                      <div className="grid auto-rows-max items-start w-[80vh] gap-4 lg:gap-8">
                        {selectedFile && (
                          <div className="control-section">
                            <iframe src={selectedFile} width="100%" height="900px"></iframe>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
