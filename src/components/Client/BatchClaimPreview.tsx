"use client";
import { useEffect, useState } from "react";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FileUploader from "@/components/Client/ClaimPreviewLoader"; // Assuming this is the correct path
import { axios } from "@/utils/axios";

export default function BatchClaimPreview() {
  const router = useRouter();
  const { id } = useParams();

  const [batchData, setBatchData] = useState(null);
  const [claimsData, setClaimsData] = useState([]);
  const [documentsData, setDocumentsData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingClaimIndex, setEditingClaimIndex] = useState(null);
  const [formValues, setFormValues] = useState({
    field1: "",
    field2: "",
    field3: "",
    field4: "",
    field5: "",
    field6: "",
    field7: "",
  });

  useEffect(() => {
    if (!id) {
      setError("No batch ID provided.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const batchResponse = await axios.get(`/clients/batches/${id}`);
        const batch = batchResponse.data;

        const claims = await Promise.all(
          batch.batch.claims.map(async (claimId) => {
            const claimResponse = await axios.get(`/clients/claims/${claimId}`);
            const claim = claimResponse.data;
            return claim;
          })
        );

        setBatchData(batch.batch);
        setClaimsData(claims);

        const allDocuments = claims.flatMap((claim) =>
          claim.claim.documents.map((document) => ({
            ...document,
            claimNumber: claim.claim.claimNumber,
          }))
        );
        setDocumentsData(allDocuments);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch batch data:", error);
        setError("Failed to fetch batch data.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleFileSelect = (file) => {
    setSelectedFile(file.preview);
  };

  const handleApprove = async () => {
    try {
      const claimResponse = await axios.put(`/admin/batch/${id}/approve`);
      toast.success("Batch approved Successfully");
      router.push("/dashboard/client/Claimsmanagement");
    } catch (error) {
      toast.warn("An error occurred.", error);
    }
  };

  const handleViewFile = (url) => {
    setSelectedFile(`http://localhost:5000${url}`);
  };

  const handleEditClaim = (index) => {
    setEditingClaimIndex(index);
    const claim = claimsData[index];
    setFormValues({
      field1: claim.field1 || "",
      field2: claim.field2 || "",
      field3: claim.field3 || "",
      field4: claim.field4 || "",
      field5: claim.field5 || "",
      field6: claim.field6 || "",
      field7: claim.field7 || "",
    });
  };

  const handleSaveClaim = () => {
    const updatedClaims = [...claimsData];
    updatedClaims[editingClaimIndex] = {
      ...updatedClaims[editingClaimIndex],
      ...formValues,
    };
    setClaimsData(updatedClaims);
    setEditingClaimIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingClaimIndex(null);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/admin/batch/submit", claimsData);
      toast.success("Data submitted successfully");
    } catch (error) {
      toast.error("Failed to submit data");
    }
  };

  const initialFiles = documentsData.map((document) => ({
    preview: document.url,
    name: document.claimNumber,
    size: 0, // If you have the size, you can use it here
  }));

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-white/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex between gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => router.push("/dashboard/client/Claimsmanagement")}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Batch Claim Information
              </h1>
              <Badge variant="outline" className="ml-auto sm:ml-0">
                {batchData.status}
              </Badge>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button size="sm" onClick={handleApprove}>
                  Approve
                </Button>
                <Button size="sm" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                {editingClaimIndex === null ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>{batchData.batchNumber}</CardTitle>
                      <CardDescription>Details about this Batch</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="providerCode">Provider Code</Label>
                          <Input
                            id="providerCode"
                            type="text"
                            className="w-full"
                            value={batchData.providerCode}
                            readOnly
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="providerName">Provider Name</Label>
                          <Input
                            id="providerName"
                            type="text"
                            className="w-full"
                            value={batchData.providerName}
                            readOnly
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
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
                          <Label htmlFor="field1">Field 1</Label>
                          <Input
                            id="field1"
                            type="text"
                            className="w-full"
                            value={formValues.field1}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                field1: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="field2">Field 2</Label>
                          <Input
                            id="field2"
                            type="text"
                            className="w-full"
                            value={formValues.field2}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                field2: e.target.value,
                              })
                            }
                          />
                        </div>
                        {/* Repeat for other fields */}
                        <div className="grid gap-3">
                          <Label htmlFor="field3">Field 3</Label>
                          <Input
                            id="field3"
                            type="text"
                            className="w-full"
                            value={formValues.field3}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                field3: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="field4">Field 4</Label>
                          <Input
                            id="field4"
                            type="text"
                            className="w-full"
                            value={formValues.field4}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                field4: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="field5">Field 5</Label>
                          <Input
                            id="field5"
                            type="text"
                            className="w-full"
                            value={formValues.field5}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                field5: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="field6">Field 6</Label>
                          <Input
                            id="field6"
                            type="text"
                            className="w-full"
                            value={formValues.field6}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                field6: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="field7">Field 7</Label>
                          <Input
                            id="field7"
                            type="text"
                            className="w-full"
                            value={formValues.field7}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                field7: e.target.value,
                              })
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
                    <CardTitle>Attachments</CardTitle>
                    <CardDescription>Accompanying documents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileUploader
                      onFileSelect={handleFileSelect}
                      initialFiles={initialFiles}
                      onViewFile={handleViewFile}
                      onEdit={handleEditClaim} // Pass the handleEditClaim function
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="grid auto-rows-max items-start w-[80vh] gap-4 lg:gap-8">
                {selectedFile && (
                  <div className="control-section">
                    <iframe
                      src={selectedFile}
                      width="100%"
                      height="900px"
                    ></iframe>
                  </div>
                )}
              </div>
            </div>
          </div>
          <ToastContainer />
        </main>
      </div>
    </div>
  );
}
