'use client';

import { useState, useTransition, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, FileCheck, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import type { ProResult } from '@/app/actions';
import { analyzeDocument } from '@/app/actions';
import DocumentAnalysis from '@/components/DocumentAnalysis';
import ResultsSkeleton from '@/components/ResultsSkeleton';

export default function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<ProResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
        if (selectedFile.type !== 'application/pdf') {
            toast({
                title: "Invalid File Type",
                description: "Please upload a PDF document.",
                variant: "destructive",
            });
            return;
        }
        if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
             toast({
                title: "File Too Large",
                description: "Please upload a file smaller than 5MB.",
                variant: "destructive",
            });
            return;
        }
      setFile(selectedFile);
    }
  };
  
  const clearFile = () => {
    setFile(null);
    setResults(null);
    const input = document.getElementById('file-upload') as HTMLInputElement;
    if (input) input.value = '';
  }

  const handleAnalysis = useCallback(() => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a document to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    setResults(null);

    startTransition(async () => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const dataUri = reader.result as string;
            try {
                const data = await analyzeDocument(dataUri, file.name);
                setResults(data);
            } catch (error) {
                let message = 'An unknown error occurred during analysis.';
                if (error instanceof Error) {
                    message = error.message;
                }
                setResults(null);
                toast({
                  title: "Analysis Error",
                  description: message,
                  variant: "destructive",
                });
            }
        };
        reader.onerror = (error) => {
             toast({
                title: "File Read Error",
                description: "Could not read the selected file.",
                variant: "destructive",
            });
        }
        
      } catch (error) {
         let message = 'An unknown error occurred.';
        if (error instanceof Error) {
            message = error.message;
        }
        setResults(null);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        })
      }
    });
  }, [file, toast]);

  return (
    <div className='space-y-8'>
        <div className="flex w-full items-center justify-center">
            {!file ? (
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PDF (MAX. 5MB)</p>
                    </div>
                    <Input id="file-upload" type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
                </label>
            ) : (
                 <div className="w-full p-4 border rounded-lg bg-muted/20 flex items-center justify-between">
                    <div className='flex items-center gap-3'>
                        <FileCheck className="h-6 w-6 text-green-500" />
                        <span className="font-medium">{file.name}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Button onClick={handleAnalysis} disabled={isPending}>Analyze Document</Button>
                        <Button variant="ghost" size="icon" onClick={clearFile} disabled={isPending}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            )}
        </div>

        {isPending && <ResultsSkeleton />}
        
        {results && (
            <div className="mt-12 animate-in fade-in duration-500">
                <DocumentAnalysis data={results} query={file?.name || 'Document Analysis'}/>
            </div>
        )}
    </div>
  );
}
