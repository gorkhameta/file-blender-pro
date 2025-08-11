import { Upload, FileText, Image, File } from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  className?: string;
}

export function UploadZone({ onFilesSelected, className }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "upload-zone relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300",
          "hover:border-primary hover:bg-muted/30",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          isDragOver && "border-primary bg-primary/5 scale-105 shadow-glow",
          isDragOver ? "dragover" : "border-muted-foreground/25"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.tiff,.bmp,.xls,.xlsx,.ppt,.pptx"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            "w-16 h-16 rounded-full bg-gradient-upload flex items-center justify-center transition-all duration-300",
            isDragOver && "scale-110 bg-primary/10"
          )}>
            <Upload className={cn(
              "w-8 h-8 text-muted-foreground transition-colors duration-300",
              isDragOver && "text-primary"
            )} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              {isDragOver ? "Drop files here" : "Drop files here or click to upload"}
            </h3>
            <p className="text-muted-foreground max-w-md">
              Support for PDF, Word, Excel, PowerPoint, JPG, PNG, TIFF, and more
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>PDF</span>
            </div>
            <div className="flex items-center gap-1">
              <Image className="w-4 h-4" />
              <span>Images</span>
            </div>
            <div className="flex items-center gap-1">
              <File className="w-4 h-4" />
              <span>Documents</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}