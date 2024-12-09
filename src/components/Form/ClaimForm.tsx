"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Upload,
  Users2,
} from "lucide-react";
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
import { Dialog, DialogContent, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/BatchClaimsLoader";
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

registerLicense("Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXpccHVQQ2ZfU0d1XUs=");

function ClaimForm({
  title,
  providerCode,
  providerName,
  initialBadgeText,
  onApprove,
  onReturn,
  submitReturn,
}) {
  const router = useRouter();
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file.preview);
  };

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
                onClick={() => router.push("/dashboard/client/claim-approvals")}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {title}
              </h1>
              <Badge variant="outline" className="ml-auto sm:ml-0">
                {initialBadgeText}
              </Badge>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button size="sm" onClick={onApprove}>
                  Submit
                </Button>

                <Dialog>
                  <DialogTrigger>
                    <Button size="sm" variant="outline" onClick={() => setShowReturnDialog(true)}>
                      Return
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <h2>Reason for Return</h2>
                    <Input
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      placeholder="Type the reason for return here..."
                    />
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          submitReturn(returnReason);
                          setShowReturnDialog(false);
                        }}
                      >
                        Submit
                      </Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>Details about this Claim</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="providerCode">Provider Code</Label>
                        <Input
                          id="providerCode"
                          type="text"
                          className="w-full"
                          defaultValue={providerCode}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="providerName">Provider Name</Label>
                        <Input
                          id="providerName"
                          type="text"
                          defaultValue={providerName}
                          className="w-full"
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
                    <Loader onFileSelect={handleFileSelect} />
                  </CardContent>
                </Card>
              </div>
              <div className="grid auto-rows-max items-start w-[80vh] gap-4 lg:gap-8">
                {selectedFile && (
                  <div className="control-section">
                    <PdfViewerComponent
                      id="container"
                      documentPath={selectedFile.preview}
                      resourceUrl="https://cdn.syncfusion.com/ej2/23.1.40/dist/ej2-pdfviewer-lib"
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
          </div>
          <ToastContainer />
        </main>
      </div>
    </div>
  );
}

export default ClaimForm;
