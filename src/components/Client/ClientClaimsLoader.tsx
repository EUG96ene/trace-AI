
"use client";

import * as React from "react";
import Image from "next/image";
import { Cross2Icon, UploadIcon, EyeIcon } from "@radix-ui/react-icons";
import Dropzone, { type DropzoneProps, type FileRejection } from "react-dropzone";
import { toast } from "sonner";
import { cn, formatBytes } from "@/lib/utils";
import { useControllableState } from "@/hooks/use-controllable-state";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import PDFMerger from "pdf-merger-js/browser";
import { Eye } from "lucide-react";

import { Tooltip, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface LoaderProps {
  onFileSelect: (files: File[]) => void;
  onMergeComplete: (mergedFile: File) => void;
  initialFiles?: Array<{ preview: string; name: string; size: number }>;
}

export function Loader({
  onFileSelect,
  onMergeComplete,
  initialFiles = [],
}: LoaderProps) {
  const [files, setFiles] = useControllableState({
    defaultProp: initialFiles.map(file => ({ ...file, preview: file.preview })),
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if ((files?.length ?? 0) + acceptedFiles.length > 10) {
        toast.error(`Cannot upload more than 10 files`);
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const updatedFiles = files ? [...files, ...newFiles] : newFiles;

      setFiles(updatedFiles);
      onFileSelect(updatedFiles);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`File ${file.name} was rejected`);
        });
      }
    },
    [files, onFileSelect, setFiles]
  );

  function onRemove(index: number) {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFileSelect(newFiles);
  }

  const mergeDocuments = async () => {
    const merger = new PDFMerger();
    for (const file of files) {
      await merger.add(file);
    }

    const mergedPdf = await merger.saveAsBlob();
    const mergedFile = new File([mergedPdf], "merged.pdf", { type: "application/pdf" });
    const mergedFilePreview = URL.createObjectURL(mergedFile);

    setFiles([...files, mergedFile]);
    onMergeComplete(mergedFile);
  };

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden">
      <Dropzone
        onDrop={onDrop}
        accept={{ "application/pdf": [] }}
        maxSize={1024 * 1024 * 10}
        maxFiles={10}
        multiple
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
              "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isDragActive && "border-muted-foreground/50"
            )}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed p-3">
                  <UploadIcon
                    className="size-7 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <p className="font-medium text-muted-foreground">
                  Drop the files here
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed p-3">
                  <UploadIcon
                    className="size-7 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <div className="space-y-px">
                  <p className="font-medium text-muted-foreground">
                    Drag {'n'} drop file here, or click to select file
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    You can upload up to 10 files (up to 10MB each)
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Dropzone>
      {files?.length ? (
        <ScrollArea className="h-fit w-full px-3">
          <div className="max-h-48 space-y-4">
            {files?.map((file, index) => (
              <FileCard
                key={index}
                file={file}
                onRemove={() => onRemove(index)}
                onView={() => onFileSelect([file])} // Trigger view action
              />
            ))}
          </div>
        </ScrollArea>
      ) : null}
      {files?.length > 1 && (
        <Button onClick={mergeDocuments}>
          Merge Documents
        </Button>
      )}
    </div>
  );
}

interface FileCardProps {
  file: { preview: string; name: string; size: number };
  onRemove: () => void;
  onView: () => void;
}

function FileCard({ file, onRemove, onView }: FileCardProps) {
  return (
    <div className="relative flex items-center space-x-4">
      <div className="flex flex-1 space-x-4">
        {isFileWithPreview(file) ? (
          <Image
            src={file.preview}
            alt={file.name}
            width={40}
            height={40}
            loading="lazy"
            className="aspect-square shrink-0 object-cover"
            layout="fixed"
          />
        ) : null}
        <div className="flex w-full flex-col gap-2">
          <div className="space-y-px">
            <p className="line-clamp-1 text-sm font-medium text-foreground/80">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(file.size)}
            </p>
          </div>
         
        </div>
      </div>
      <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip content="View and Annotate">
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="size-7"
              onClick={onView}
            >
              <Eye className="size-4" />
            </Button>
          </TooltipTrigger>
        </Tooltip>
        <Tooltip content="Remove">
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="size-7"
              onClick={onRemove}
            >
              <Cross2Icon className="size-4" />
            </Button>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
      </div>
    </div>
  );
}

function isFileWithPreview(file: { preview: string }): file is { preview: string } {
  return "preview" in file && typeof file.preview === "string";
}

export default Loader;
