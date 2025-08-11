import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  X, 
  FileText, 
  Image, 
  File,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FileItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
  outputUrl?: string;
  convertTo?: string;
}

interface FileListProps {
  files: FileItem[];
  onRemoveFile: (id: string) => void;
  onUpdateConversion: (id: string, convertTo: string) => void;
  toolType: string;
}

export function FileList({ files, onRemoveFile, onUpdateConversion, toolType }: FileListProps) {
  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return FileText;
    if (file.type.includes('image')) return Image;
    return File;
  };

  const getFileTypeColor = (file: File) => {
    if (file.type.includes('pdf')) return 'bg-red-100 text-red-700';
    if (file.type.includes('image')) return 'bg-green-100 text-green-700';
    return 'bg-blue-100 text-blue-700';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getConversionOptions = (file: File) => {
    if (toolType !== 'convert') return [];
    
    if (file.type.includes('pdf')) {
      return [
        { value: 'docx', label: 'Word (.docx)' },
        { value: 'xlsx', label: 'Excel (.xlsx)' },
        { value: 'pptx', label: 'PowerPoint (.pptx)' },
        { value: 'jpg', label: 'JPG Image' },
        { value: 'png', label: 'PNG Image' },
      ];
    }
    
    if (file.type.includes('image')) {
      return [
        { value: 'pdf', label: 'PDF Document' },
        { value: 'jpg', label: 'JPG Image' },
        { value: 'png', label: 'PNG Image' },
      ];
    }
    
    return [
      { value: 'pdf', label: 'PDF Document' },
    ];
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Files ({files.length})</h3>
        <Badge variant="outline" className="text-xs">
          {files.filter(f => f.status === 'completed').length} completed
        </Badge>
      </div>
      
      <div className="space-y-2">
        {files.map((fileItem) => {
          const Icon = getFileIcon(fileItem.file);
          const options = getConversionOptions(fileItem.file);
          
          return (
            <div
              key={fileItem.id}
              className="flex items-center gap-3 p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors"
            >
              {/* File Icon & Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileTypeColor(fileItem.file)}`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{fileItem.file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(fileItem.file.size)}
                  </p>
                </div>
              </div>

              {/* Conversion Dropdown */}
              {options.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Convert to:</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        {fileItem.convertTo ? 
                          options.find(o => o.value === fileItem.convertTo)?.label || 'Select format'
                          : 'Select format'
                        }
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {options.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => onUpdateConversion(fileItem.id, option.value)}
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {/* Status Badge */}
              <Badge 
                variant={
                  fileItem.status === 'completed' ? 'default' :
                  fileItem.status === 'processing' ? 'secondary' :
                  fileItem.status === 'error' ? 'destructive' :
                  'outline'
                }
                className="capitalize"
              >
                {fileItem.status}
              </Badge>

              {/* Remove Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFile(fileItem.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}