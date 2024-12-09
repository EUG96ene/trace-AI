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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loader from "./BatchClaimsLoader";

export default function BatchClaimForm() {
  const router = useRouter();
  const [claims, setClaims] = useState([]);
  const [providerInfo, setProviderInfo] = useState(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [batchNumber, setBatchNumber] = useState("");

  useEffect(() => {
    const fetchProviderDetails = async () => {
      const session = await getSession();
      const providerID = session?.user?.user?.provider;

      try {
        const response = await axios.get(`/providers/${providerID}`);
        const providerCode = response.data.providerCode;
        const currentDate = new Date().toISOString().split("T")[0];
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const newBatchNumber = `${currentDate}-${providerCode}-b${randomNum}`;

        setProviderInfo(response.data);
        setBatchNumber(newBatchNumber);
        setClaims([{ files: [] }]); // Initialize with a single empty claim
      } catch (error) {
        console.error("Error fetching provider details:", error);
      }
    };

    fetchProviderDetails();
  }, []);

  const handleFileSelect = (index: number, files: File[]) => {
    const updatedClaims = [...claims];
    updatedClaims[index].files = files.map((file) => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const claimNumber = `${new Date().toISOString().split("T")[0]}-${providerInfo?.providerCode}-c${randomNum}`;
      return { file, claimNumber };
    });
    setClaims(updatedClaims);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    const session = await getSession();
    const userID = session?.user?.user?._id;
    const claimsData = claims.flatMap((claim) =>
      claim.files.map(({ claimNumber }) => ({
        createdBy: userID,
        batchNumber,
        claimNumber,
        providerCode: providerInfo?.providerCode,
        providerName: providerInfo?.providerName,
      }))
    );

    formData.append("data", JSON.stringify({ claimsData }));

    claims.forEach((claim) => {
      claim.files.forEach(({ file }) => {
        formData.append("documents", file);
      });
    });

    try {
      const response = await axios.post("/claims/batches", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Batch submitted successfully");
      router.push("/dashboard/client/Claimsmanagement");
    } catch (error) {
      toast.error("Error creating claims");
      console.error("Error creating claims:", error);
    }
  };

  const handleFileView = (fileUrl: string) => {
    setSelectedFileUrl(fileUrl);
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
                  onClick={() =>
                    router.push("/dashboard/client/Claimsmanagement")
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Batch Claim Information
                </h1>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  <Button size="sm" onClick={handleSubmit}>
                    Submit
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  {claims.map((claim, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{batchNumber}</CardTitle>
                        <CardDescription>
                          Details about this Batch
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6">
                          <div className="grid gap-3">
                            <Label htmlFor={`batchNumber${index}`}>
                              Batch Number
                            </Label>
                            <Input
                              id={`batchNumber${index}`}
                              name="batchNumber"
                              type="text"
                              className="w-full"
                              value={batchNumber}
                              disabled
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor={`providerCode${index}`}>
                              Provider Code
                            </Label>
                            <Input
                              id={`providerCode${index}`}
                              name="providerCode"
                              type="text"
                              className="w-full"
                              value={providerInfo?.providerCode}
                              disabled
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor={`providerName${index}`}>
                              Provider Name
                            </Label>
                            <Input
                              id={`providerName${index}`}
                              name="providerName"
                              type="text"
                              className="w-full"
                              value={providerInfo?.providerName}
                              disabled
                            />
                          </div>
                        </div>
                      </CardContent>
                      <Card className="overflow-hidden">
                        <CardHeader>
                          <CardTitle>Attachments</CardTitle>
                          <CardDescription>
                            Accompanying claim documents for this batch
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Loader
                            onFileSelect={(files) => handleFileSelect(index, files)}
                            onFileView={handleFileView}
                          />
                        </CardContent>
                      </Card>
                    </Card>
                  ))}
                </div>
                <div className="lg:col-span-1 w-[70vh]">
                  {selectedFileUrl && (
                    <div className="overflow-hidden rounded-lg shadow-lg">
                      <iframe
                        src={selectedFileUrl}
                        width="100%"
                        height="860px"
                        className="border-0"
                        title="Document Preview"
                      />
                    </div>
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
