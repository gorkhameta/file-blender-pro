import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface FileItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
  outputUrl?: string;
  convertTo?: string;
}

interface ProcessingViewProps {
  files: FileItem[];
}

export function ProcessingView({ files }: ProcessingViewProps) {
  const processingFiles = files.filter(f => f.status === 'processing');
  const completedFiles = files.filter(f => f.status === 'completed');
  const errorFiles = files.filter(f => f.status === 'error');
  
  const totalFiles = files.length;
  const overallProgress = files.reduce((acc, file) => {
    if (file.status === 'completed') return acc + 100;
    if (file.status === 'processing') return acc + (file.progress || 0);
    return acc;
  }, 0) / totalFiles;

  return (
    <div className="space-y-6 p-6 bg-muted/20 rounded-lg border">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="font-semibold">Processing Files...</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {completedFiles.length} of {totalFiles} files completed
        </p>
      </div>

      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Overall Progress</span>
          <span>{Math.round(overallProgress)}%</span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      {/* Individual File Progress */}
      <div className="space-y-3">
        {files.map((file) => (
          <div key={file.id} className="flex items-center gap-3 p-3 bg-background rounded-lg">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {file.status === 'processing' && (
                <Loader2 className="w-4 h-4 animate-spin text-primary flex-shrink-0" />
              )}
              {file.status === 'completed' && (
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
              )}
              {file.status === 'error' && (
                <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
              )}
              
              <span className="font-medium truncate">{file.file.name}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {file.status === 'processing' && (
                <div className="w-24">
                  <Progress value={file.progress || 0} className="h-1" />
                </div>
              )}
              
              <Badge 
                variant={
                  file.status === 'completed' ? 'default' :
                  file.status === 'processing' ? 'secondary' :
                  file.status === 'error' ? 'destructive' :
                  'outline'
                }
                className="text-xs"
              >
                {file.status === 'processing' ? `${file.progress || 0}%` : file.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <span>{processingFiles.length} Processing</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-success"></div>
          <span>{completedFiles.length} Completed</span>
        </div>
        {errorFiles.length > 0 && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-destructive"></div>
            <span>{errorFiles.length} Failed</span>
          </div>
        )}
      </div>
    </div>
  );
}