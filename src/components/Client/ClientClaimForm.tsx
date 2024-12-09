// ClaimForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { axios } from "@/utils/axios";
import { ChevronLeft } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "./ClientClaimsLoader";

export default function ClaimForm() {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [viewingFileUrl, setViewingFileUrl] = useState<string | null>(null);
  const [providerInfo, setProviderInfo] = useState(null);
  const [claimData, setClaimData] = useState({
    claimNumber: "",
    providerCode: "",
    providerName: "",
  });

  useEffect(() => {
    const fetchProviderDetails = async () => {
      const session = await getSession();
      const providerID = session?.user?.user?.provider;

      try {
        const response = await axios.get(`/providers/${providerID}`);
        const providerCode = response.data.providerCode;

        // Generate claim number
        const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
        const randomNum = Math.floor(1000 + Math.random() * 9000); // Generates a random 4-digit number
        const newClaimNumber = `${currentDate}-${providerCode}-c${randomNum}`;

        setProviderInfo(response.data);
        setClaimData((prevData) => ({
          ...prevData,
          providerCode: providerCode,
          providerName: response.data.providerName,
          claimNumber: newClaimNumber,
        }));
      } catch (error) {
        console.error("Error fetching provider details:", error);
      }
    };

    fetchProviderDetails();
  }, []);

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files);
    if (files.length > 0) {
      setViewingFileUrl(URL.createObjectURL(files[0]));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClaimData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please upload a document.");
      return;
    }

    const formData = new FormData();
    formData.append("document", selectedFiles); // Append the actual file object
    formData.append("data", JSON.stringify({ claimData }));

    try {
      await axios.post("clients/claim/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Claim created successfully");
      router.push("/dashboard/client/Claimsmanagement");
    } catch (error) {
      toast.error("Error creating claim");
      console.error("Error creating claim:", error);
    }
  };

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
                  onClick={() => router.push("/dashboard/client/Claimsmanagement")}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Claim Information
                </h1>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  <Button size="sm" onClick={handleSubmit}>
                    Submit
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>{claimData.claimNumber || "New Claim"}</CardTitle>
                      <CardDescription>Details about this Claim</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="claimNumber">Claim Number</Label>
                          <Input
                            id="claimNumber"
                            name="claimNumber"
                            type="text"
                            className="w-full"
                            value={claimData.claimNumber}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="providerCode">Provider Code</Label>
                          <Input
                            id="providerCode"
                            name="providerCode"
                            type="text"
                            className="w-full"
                            value={claimData.providerCode}
                            disabled
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="providerName">Provider Name</Label>
                          <Input
                            id="providerName"
                            name="providerName"
                            type="text"
                            className="w-full"
                            value={claimData.providerName}
                            disabled
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>Attachments</CardTitle>
                      <CardDescription>Accompanying documents</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Loader onFileSelect={handleFileSelect} onMergeComplete={handleFileSelect} />
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:col-span-1 w-[74vh]">
                  {viewingFileUrl && (
                    <iframe
                      height={900}
                      src={viewingFileUrl}
                      title="pdf-viewer"
                      width="100%"
                    ></iframe>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
