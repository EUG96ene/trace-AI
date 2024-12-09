import React, { useEffect, useRef } from 'react';
import { pdfjs } from 'react-pdf';

interface PDFPageProps {
  pdf: any;
  pageNumber: number;
  scale?: number;
  onClick?: () => void;
  isSelected?: boolean;
}

const PDFPage: React.FC<PDFPageProps> = ({ pdf, pageNumber, scale = 1.0, onClick, isSelected }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderPage = async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
      } catch (error) {
        console.error(`Error rendering page ${pageNumber}:`, error);
      }
    };

    renderPage();
  }, [pdf, pageNumber, scale]);

  return (
    <div
      className={`cursor-pointer mb-4 ${isSelected ? 'border-2 border-blue-500' : 'border'}`}
      onClick={onClick}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default PDFPage;
