'use client';
import React, { useState, useEffect } from 'react';
import { pdfjs } from 'react-pdf';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { axios } from '@/utils/axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const DynamicPDFPage = dynamic(() => import('./PageViewer'), {
  ssr: false,
  loading: () => <p>Loading PDF Page...</p>
});

interface PDFViewerProps {
  documentUrl: string;
  showDocumentView: (show: boolean) => void;
  batchNumber: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ documentUrl, showDocumentView, batchNumber }) => {
  const [pdf, setPdf] = useState<any>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showFields, setShowFields] = useState<boolean>(false);
  const [fields, setFields] = useState({
    invoiceNumber: '',
    providerName: '',
    providerCode: '',
    amount: '',
    invoiceDate: '',
    barcode: '',
    clientName: '',
  });
  const [claimStatus, setClaimStatus] = useState<'pending' | 'submitted' | 'suspended'>('pending');
  const [providerNames, setProviderNames] = useState<string[]>([]);
  const [providerCodes, setProviderCodes] = useState<string[]>([]);
  const [selectedProviderName, setSelectedProviderName] = useState<string>('');
  const [selectedProviderCode, setSelectedProviderCode] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

    const fetchPDF = async () => {
      try {
        const loadingTask = pdfjs.getDocument(documentUrl);
        const loadedPdf = await loadingTask.promise;
        setPdf(loadedPdf);
        setNumPages(loadedPdf.numPages);
      } catch (error) {
        setError('Failed to load PDF document.');
        console.error(error);
      }
    };

    fetchPDF();
  }, [documentUrl]);

  const togglePageSelection = (page: number) => {
    setSelectedPages(prev =>
      prev.includes(page) ? prev.filter(p => p !== page) : [...prev, page]
    );
  };

  const splitDocument = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/admin/split-document', {
        documentUrl,
        selectedPages,
        batchNumber,
      });
      toast.success('Document split successfully.');
      setShowFields(true); // Show fields when document is split
    } catch (error) {
      toast.error('Failed to split document.');
      setError('Failed to split document.');
    } finally {
      setLoading(false);
    }
  };

  const closeDocumentView = () => showDocumentView(false);

  const handleDateChange = (field: string, date: Date | null) => {
    if (date) {
      setFields(prev => ({ ...prev, [field]: date.toISOString() }));
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFields(prev => ({ ...prev, [field]: value }));
  };

  const handleInvoiceNumberChange = async (value: string) => {
    setFields(prev => ({ ...prev, invoiceNumber: value }));
    if (value) {
      try {
        const response = await axios.post("/admin/lookup-claim-data", {
          invoiceNumber: value,
          batchNumber,
        });

        const claimData = response.data;

        // Handle multiple provider names or codes
        if (Array.isArray(claimData.providerName)) {
          setProviderNames(claimData.providerName);
          setSelectedProviderName(claimData.providerName[0]);
        } else {
          setProviderNames([claimData.providerName]);
          setSelectedProviderName(claimData.providerName);
        }

        if (Array.isArray(claimData.providerCode)) {
          setProviderCodes(claimData.providerCode);
          setSelectedProviderCode(claimData.providerCode[0]);
        } else {
          setProviderCodes([claimData.providerCode]);
          setSelectedProviderCode(claimData.providerCode);
        }

        setFields(prev => ({
          ...prev,
          providerName: Array.isArray(claimData.providerName) ? '' : claimData.providerName,
          providerCode: Array.isArray(claimData.providerCode) ? '' : claimData.providerCode,
          amount: claimData.amount,
        }));
      } catch (error) {
        toast.error("Failed to lookup claim data");
      }
    }
  };

  const handleSubmit = async () => {
    const session = await getSession();
    const stampedBy = session?.user?.name || "Unknown";

    try {
      const updatedFields = Object.fromEntries(Object.entries(fields).filter(([key, value]) => value));

      const payload = {
        batchId: batchNumber,
        stampedBy,
        claims: [{
          ...updatedFields,
          providerName: selectedProviderName,
          providerCode: selectedProviderCode,
        }],
      };

      await axios.post("/admin/submit-claims", payload);
      setClaimStatus('submitted');
      toast.success("Data submitted successfully");
      setTimeout(() => {
        router.push("/dashboard/admin/claim-approvals");
      }, 3000);
      // Unselect the selected pages
      setSelectedPages([]);
      setShowFields(false);
    } catch (error) {
      setClaimStatus('suspended');
      toast.error("Failed to submit data");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-[24rem] p-4 border-r overflow-y-auto">
        <Button onClick={closeDocumentView} className="mb-4 w-full">
          Back to Batch Information
        </Button>
        <Button
          onClick={splitDocument}
          disabled={loading || selectedPages.length === 0}
          className={`mb-4 ${loading || selectedPages.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Splitting...' : 'Split Selected Pages'}
        </Button>
        {pdf && Array.from({ length: numPages ?? 0 }, (_, index) => (
          <DynamicPDFPage
            key={index}
            pdf={pdf}
            pageNumber={index + 1}
            onClick={() => togglePageSelection(index + 1)}
            isSelected={selectedPages.includes(index + 1)}
            scale={0.5}
          />
        ))}
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {pdf && Array.from({ length: numPages ?? 0 }, (_, index) => (
          <DynamicPDFPage
            key={index}
            pdf={pdf}
            pageNumber={index + 1}
            scale={0.75} // Adjust scale as needed to fit the document view
          />
        ))}
      </div>
      <div className="w-[24rem] p-4 border-l overflow-y-auto">
        <h3 className="font-bold">Claim Details</h3>
        <Badge variant="outline" className="mb-4">
          {claimStatus}
        </Badge>
        {showFields ? (
          <>
            <div className="mb-2">
              <Label>Invoice Number</Label>
              <Input
                value={fields.invoiceNumber}
                onChange={e => handleInvoiceNumberChange(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="mb-2">
              <Label>Provider Name</Label>
              {providerNames.length > 1 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full">{selectedProviderName || 'Select Provider Name'}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {providerNames.map((name, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => setSelectedProviderName(name)}
                      >
                        {name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Input
                  value={fields.providerName}
                  onChange={e => handleFieldChange('providerName', e.target.value)}
                  className="w-full"
                />
              )}
            </div>
            <div className="mb-2">
              <Label>Provider Code</Label>
              {providerCodes.length > 1 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full">{selectedProviderCode || 'Select Provider Code'}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {providerCodes.map((code, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => setSelectedProviderCode(code)}
                      >
                        {code}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Input
                  value={fields.providerCode}
                  onChange={e => handleFieldChange('providerCode', e.target.value)}
                  className="w-full"
                />
              )}
            </div>
            <div className="mb-2">
              <Label>Amount</Label>
              <Input
                value={fields.amount}
                onChange={e => handleFieldChange('amount', e.target.value)}
                className="w-full"
              />
            </div>
            <div className="mb-2">
              <Label>Barcode</Label>
              <Input
                value={fields.barcode}
                onChange={e => handleFieldChange('barcode', e.target.value)}
                className="w-full"
              />
            </div>
            <div className="mb-2">
              <Label>Client Name</Label>
              <Input
                value={fields.clientName}
                onChange={e => handleFieldChange('clientName', e.target.value)}
                className="w-full"
              />
            </div>
            <div className="mb-2">
              <Label>Invoice Date</Label>
              <DatePicker
                selected={fields.invoiceDate ? new Date(fields.invoiceDate) : null}
                onChange={(date) => handleDateChange('invoiceDate', date)}
                customInput={<Input />}
                dateFormat="yyyy/MM/dd"
                className="w-full"
              />
            </div>
            <Button onClick={handleSubmit} className="w-full mt-4">
              Submit Claims
            </Button>
          </>
        ) : (
          <p>Select pages and click Split to show fields</p>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default PDFViewer;
