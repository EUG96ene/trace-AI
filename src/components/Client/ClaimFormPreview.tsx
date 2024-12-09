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
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FileUploader from "@/components/Client/ClaimPreviewLoader"; // Assuming this is the correct path
import { axios } from "@/utils/axios";
import { Eye } from "lucide-react";

export default function ClaimDetails() {
  const router = useRouter();
  const { id } = useParams();
  console.log("Claim ID:", id);

  const [claimData, setClaimData] = useState(null);
  const [documentData, setDocumentData] = useState([]);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("No claim ID provided.");
      setLoading(false);
      return;
    }

    console.log("Claim ID:", id); // Debugging line to check claim ID

    const fetchData = async () => {
      try {
        const claimResponse = await axios.get(`/clients/claims/${id}`);
        console.log("Claim Data:", claimResponse.data); // Debugging line to check claim data
        setClaimData(claimResponse.data.claim);

        if (claimResponse.data.claim.documents.length > 0) {
          const documentId = claimResponse.data.claim.documents[0]; // Get the first document ID
          const documentResponse = await axios.get(`/claims/documents/${documentId._id}`);
          console.log("Document Response:", documentResponse);
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

  const handleFileSelect = (file) => {
    setSelectedFile(file.preview);
  };

  const handleApprove = async () => {
    try {
      toast.success("Claim Submitted Successfully");
    } catch (error) {
      toast.warn("An error occurred.", error);
    }
  };

  const handleReturn = () => {
    setShowReturnDialog(true);
  };

  const submitReturn = () => {
    console.log(returnReason); // Log or handle the return reason
  };

  const handleViewFile = (url) => {
    setSelectedFile(`http://localhost:5000${url}`);
  };

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
                Claim Information
              </h1>
              <Badge variant="outline" className="ml-auto sm:ml-0">
                {claimData.status}
              </Badge>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button size="sm" onClick={handleApprove}>
                  Submit
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>{claimData.claimNumber}</CardTitle>
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
                          value={claimData.providerCode}
                          readOnly
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="providerName">Provider Name</Label>
                        <Input
                          id="providerName"
                          type="text"
                          className="w-full"
                          value={claimData.providerName}
                          readOnly
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>Attachments</CardTitle>
                    <CardDescription>
                      Accompanying documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileUploader
                      onFileSelect={handleFileSelect}
                      initialFiles={[{
                        preview: `${documentData[0]?.url}`,
                        name: documentData[0]?.documentType,
                        size: 0,
                      }]}
                      onViewFile={handleViewFile}
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
