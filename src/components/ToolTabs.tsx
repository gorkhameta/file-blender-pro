import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Merge, 
  Split, 
  Archive, 
  ScanText, 
  Shield, 
  Droplets, 
  RotateCw,
  Download,
  Scissors
} from "lucide-react";
import { UploadZone } from "./UploadZone";
import { FileList } from "./FileList";
import { ProcessingView } from "./ProcessingView";
import { useState } from "react";

interface FileItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
  outputUrl?: string;
  convertTo?: string;
}

export function ToolTabs() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeTab, setActiveTab] = useState("convert");

  const handleFilesSelected = (newFiles: File[]) => {
    const fileItems: FileItem[] = newFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      status: 'pending',
      convertTo: activeTab === 'convert' ? 'pdf' : undefined
    }));
    
    setFiles(prev => [...prev, ...fileItems]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateFileConversion = (id: string, convertTo: string) => {
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, convertTo } : f
    ));
  };

  const startProcessing = () => {
    setFiles(prev => prev.map(f => 
      f.status === 'pending' ? { ...f, status: 'processing' as const, progress: 0 } : f
    ));
    
    // Simulate processing
    files.forEach((file, index) => {
      if (file.status === 'pending') {
        setTimeout(() => {
          const interval = setInterval(() => {
            setFiles(prev => prev.map(f => {
              if (f.id === file.id && f.status === 'processing') {
                const newProgress = Math.min((f.progress || 0) + 10, 100);
                if (newProgress === 100) {
                  clearInterval(interval);
                  return { 
                    ...f, 
                    status: 'completed' as const, 
                    progress: 100,
                    outputUrl: `#download-${f.id}`
                  };
                }
                return { ...f, progress: newProgress };
              }
              return f;
            }));
          }, 200);
        }, index * 500);
      }
    });
  };

  const tools = [
    {
      id: "convert",
      label: "Convert",
      icon: FileText,
      description: "Convert between PDF, Word, Excel, PowerPoint, and images",
      badge: "Popular"
    },
    {
      id: "merge",
      label: "Merge",
      icon: Merge,
      description: "Combine multiple PDFs into one document"
    },
    {
      id: "split",
      label: "Split",
      icon: Split,
      description: "Split PDFs into separate pages or ranges"
    },
    {
      id: "compress",
      label: "Compress",
      icon: Archive,
      description: "Reduce PDF file size while maintaining quality"
    },
    {
      id: "ocr",
      label: "OCR",
      icon: ScanText,
      description: "Extract text from scanned documents and images",
      badge: "AI"
    },
    {
      id: "protect",
      label: "Protect",
      icon: Shield,
      description: "Add or remove password protection"
    },
    {
      id: "watermark",
      label: "Watermark",
      icon: Droplets,
      description: "Add or remove watermarks from documents"
    },
    {
      id: "rotate",
      label: "Rotate",
      icon: RotateCw,
      description: "Rotate and reorder pages"
    }
  ];

  const hasFiles = files.length > 0;
  const isProcessing = files.some(f => f.status === 'processing');
  const hasCompleted = files.some(f => f.status === 'completed');

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto p-1 bg-muted/30">
          {tools.map((tool) => (
            <TabsTrigger
              key={tool.id}
              value={tool.id}
              className="flex flex-col gap-1 p-3 data-[state=active]:bg-background data-[state=active]:shadow-sm min-h-[4rem]"
            >
              <div className="flex items-center gap-1">
                <tool.icon className="w-4 h-4" />
                {tool.badge && (
                  <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                    {tool.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium">{tool.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tools.map((tool) => (
          <TabsContent key={tool.id} value={tool.id} className="mt-6">
            <div className="space-y-6">
              {/* Tool Description */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                  <tool.icon className="w-6 h-6" />
                  {tool.label}
                  {tool.badge && (
                    <Badge variant="outline" className="text-xs">
                      {tool.badge}
                    </Badge>
                  )}
                </h2>
                <p className="text-muted-foreground">{tool.description}</p>
              </div>

              {/* Main Content Area */}
              {!hasFiles && (
                <UploadZone 
                  onFilesSelected={handleFilesSelected}
                  className="animate-fade-in"
                />
              )}

              {hasFiles && (
                <div className="space-y-6 animate-fade-in">
                  <FileList
                    files={files}
                    onRemoveFile={removeFile}
                    onUpdateConversion={updateFileConversion}
                    toolType={tool.id}
                  />
                  
                  {isProcessing && (
                    <ProcessingView files={files} />
                  )}
                  
                  {hasCompleted && (
                    <div className="text-center space-y-4 p-6 bg-success/5 rounded-lg border border-success/20">
                      <div className="flex items-center justify-center gap-2 text-success">
                        <Download className="w-5 h-5" />
                        <span className="font-semibold">Processing Complete!</span>
                      </div>
                      <div className="flex flex-wrap justify-center gap-3">
                        {files.filter(f => f.status === 'completed').map(file => (
                          <a
                            key={file.id}
                            href={file.outputUrl}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-success text-success-foreground rounded-lg hover:bg-success/90 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download {file.file.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {!isProcessing && !hasCompleted && (
                    <div className="text-center">
                      <button
                        onClick={startProcessing}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-primary text-white rounded-lg hover:shadow-glow hover:scale-105 transition-all duration-300 font-semibold"
                      >
                        <tool.icon className="w-5 h-5" />
                        Start {tool.label}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Add More Files Button */}
              {hasFiles && (
                <div className="text-center">
                  <UploadZone 
                    onFilesSelected={handleFilesSelected}
                    className="border-dashed border-muted-foreground/25 bg-muted/20 hover:bg-muted/40"
                  />
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}