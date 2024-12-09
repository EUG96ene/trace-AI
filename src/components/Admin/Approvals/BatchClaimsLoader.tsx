"use client";

import * as React from "react";
import Dropzone, { type DropzoneProps, type FileRejection } from "react-dropzone";
import { toast } from "sonner";
import { cn, formatBytes } from "@/lib/utils";
import { useControllableState } from "@/hooks/use-controllable-state";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Cross2Icon, UploadIcon, FileIcon } from "@radix-ui/react-icons";
import { Eye, Pencil, Split } from "lucide-react";

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: File[];
  onValueChange?: React.Dispatch<React.SetStateAction<File[]>>;
  onUpload?: (files: File[]) => Promise<void>;
  progresses?: Record<string, number>;
  accept?: DropzoneProps["accept"];
  maxSize?: DropzoneProps["maxSize"];
  maxFiles?: DropzoneProps["maxFiles"];
  multiple?: boolean;
  disabled?: boolean;
  initialFiles?: Array<{ preview: string; name: string; size: number }>;
  onSplitFile?: (url: string) => void;
  onPreview?: (url: string) => void;

  onEdit?: (index: number) => void;
}

export function FileUploader({
  value: valueProp,
  onValueChange,
  onUpload,
  progresses,
  accept = { "image/*": [], "application/pdf": [], "application/msword": [], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [] },
  maxSize = 1024 * 1024 * 5,
  maxFiles = 1,
  multiple = false,
  disabled = false,
  initialFiles = [],
  className,
  onSplitFile,
  onEdit,
  onPreview
}: FileUploaderProps) {
  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
    defaultProp: initialFiles.map(file => ({ ...file, preview: file.preview })),
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      handleDrop(acceptedFiles, rejectedFiles);
    },
    [files, maxFiles, multiple, onUpload, setFiles]
  );

  const handleDrop = (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
      toast.error("Cannot upload more than 1 file at a time");
      return;
    }

    if ((files?.length ?? 0) + acceptedFiles.length > maxFiles) {
      toast.error(`Cannot upload more than ${maxFiles} files`);
      return;
    }

    const newFiles = acceptedFiles.map(file => ({
      ...file,
      preview: URL.createObjectURL(file),
    }));

    const updatedFiles = files ? [...files, ...newFiles] : newFiles;
    setFiles(updatedFiles);

    rejectedFiles.forEach(({ file }) => {
      toast.error(`File ${file.name} was rejected`);
    });

    if (onUpload && updatedFiles.length > 0 && updatedFiles.length <= maxFiles) {
      const target = updatedFiles.length > 1 ? `${updatedFiles.length} files` : `file`;
      toast.promise(onUpload(updatedFiles), {
        loading: `Uploading ${target}...`,
        success: () => {
          setFiles([]);
          return `${target} uploaded`;
        },
        error: `Failed to upload ${target}`,
      });
    }
  };

  const onRemove = (index: number) => {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onValueChange?.(newFiles);
  };

  React.useEffect(() => {
    return () => {
      files?.forEach(file => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const isDisabled = disabled || (files?.length ?? 0) >= maxFiles;

  return (
    <div className={cn("relative flex flex-col gap-6 overflow-hidden", className)}>
   
      {files?.length ? (
        <ScrollArea className="h-full w-full px-3">
          <div className="max-h-48 space-y-4">
            {files.map((file, index) => (
              <FileCard
                key={index}
                file={file}
                onRemove={() => onRemove(index)}
                onSplitFile={() => onSplitFile && onSplitFile(file.preview)}
                onPreview={() => onPreview && onPreview(file.preview)}

                onEdit={() => onEdit && onEdit(index)}
                progress={progresses?.[file.name]}
              />
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  );
}

const DropzoneActiveContent: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
    <div className="rounded-full border border-dashed p-3">
      <UploadIcon className="size-7 text-muted-foreground" aria-hidden="true" />
    </div>
    <p className="font-medium text-muted-foreground">Drop the files here</p>
  </div>
);

const DropzoneIdleContent: React.FC<{ maxFiles: number; maxSize: number }> = ({ maxFiles, maxSize }) => (
  <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
    <div className="rounded-full border border-dashed p-3">
      <UploadIcon className="size-7 text-muted-foreground" aria-hidden="true" />
    </div>
    <div className="space-y-px">
      <p className="font-medium text-muted-foreground">Drag 'n' drop file here, or click to select file</p>
      <p className="text-sm text-muted-foreground/70">
        You can upload
        {maxFiles > 1
          ? ` ${maxFiles === Infinity ? "multiple" : maxFiles} files (up to ${formatBytes(maxSize)} each)`
          : ` a file with ${formatBytes(maxSize)}`}
      </p>
    </div>
  </div>

);

interface FileCardProps {
  file: { preview: string; name: string; size: number };
  onRemove: () => void;
  onSplitFile: () => void;
  onPreview: () => void;
  onEdit: () => void;
  progress?: number;
}

const FileCard: React.FC<FileCardProps> = ({ file, progress, onRemove, onSplitFile, onEdit, onPreview }) => (
  <div className="relative flex items-center space-x-4">
    <div className="flex flex-1 space-x-4">
      <div className="flex w-full flex-col gap-2">
        <div className="space-y-px">
          <p className="line-clamp-1 text-sm font-medium text-foreground/80">
            <FileIcon /> {file.name}
          </p>
        </div>
        {progress ? <Progress value={progress} /> : null}
      </div>
    </div>
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip content="View and Annotate">
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" className="size-7" onClick={onPreview}>
              <Eye className="size-4" />
            </Button>
          </TooltipTrigger>
        </Tooltip>
        <Tooltip content="Edit">
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" className="size-7" onClick={onEdit}>
              <Pencil className="size-4" />
            </Button>
          </TooltipTrigger>
        </Tooltip>
        <Tooltip content="Split">
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" className="size-7" onClick={onSplitFile}>
              <Split className="size-4" />
            </Button>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
);



// export default FileCard;
function isFileWithPreview(file: { preview: string }): file is { preview: string } {
  return "preview" in file && typeof file.preview === "string";
}

export default FileUploader;
