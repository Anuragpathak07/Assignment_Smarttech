import { useState, useCallback } from 'react';
import { Upload, X, FileText, Image, FileCode, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

interface FileUploadZoneProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  acceptedFormats: string[];
  accept: string;
  category: 'clinical' | 'imaging' | 'genomics';
}

export function FileUploadZone({
  title,
  description,
  icon,
  acceptedFormats,
  accept,
  category
}: FileUploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleUpload = async (file: File) => {
    const newFile: UploadedFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading',
    };

    setFiles((prev) => [...prev, newFile]);

    try {
      // Start fake progress for UX
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === newFile.id && f.progress < 90) {
            return { ...f, progress: f.progress + 10 };
          }
          return f;
        }));
      }, 300);

      // Perform real upload
      await import('@/services/api').then(mod => mod.api.uploadFile(file));

      clearInterval(interval);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === newFile.id ? { ...f, progress: 100, status: 'completed' } : f
        )
      );
    } catch (error) {
      console.error("Upload failed for file:", file.name, error);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === newFile.id ? { ...f, status: 'error' } : f
        )
      );
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach(handleUpload);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    selectedFiles.forEach(handleUpload);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.includes('json') || type.includes('csv')) return <FileCode className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <Card className="shadow-medical">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          className={cn(
            'relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          )}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={accept}
            multiple
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-3">
            <div className={cn(
              'p-3 rounded-full transition-colors',
              isDragActive ? 'bg-primary/10' : 'bg-muted'
            )}>
              <Upload className={cn(
                'h-6 w-6 transition-colors',
                isDragActive ? 'text-primary' : 'text-muted-foreground'
              )} />
            </div>
            <div>
              <p className="font-medium">
                {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-1 mt-2">
              {acceptedFormats.map((format) => (
                <span
                  key={format}
                  className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground"
                >
                  {format}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex-shrink-0 text-muted-foreground">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </span>
                    {file.status === 'uploading' && (
                      <Progress value={file.progress} className="h-1 flex-1" />
                    )}
                    {file.status === 'completed' && (
                      <div className="flex items-center gap-1 text-status-normal">
                        <CheckCircle className="h-3 w-3" />
                        <span className="text-xs">Uploaded</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
