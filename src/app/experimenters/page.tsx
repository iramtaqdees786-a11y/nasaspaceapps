'use client';

import { useState } from 'react';
import AppHeader from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Search } from 'lucide-react';
import DocumentUpload from '@/components/experimenters/DocumentUpload';
import ExperimentSearch from '@/components/experimenters/ExperimentSearch';

export default function ExperimentersPage() {
  
  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <AppHeader mode={'Pro'} setMode={() => {}} />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <Tabs defaultValue="upload" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">
                    <Upload className="mr-2 h-4 w-4" />
                    Analyze Document
                </TabsTrigger>
                <TabsTrigger value="search">
                    <Search className="mr-2 h-4 w-4" />
                    Search Experiment
                </TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="mt-8">
                 <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Analyze Your Research Document</h2>
                    <p className="text-lg text-muted-foreground">
                        Upload a research paper (PDF, max 5MB) and our AI will provide a detailed breakdown, including summaries, methodology, and key findings.
                    </p>
                </div>
                <DocumentUpload />
            </TabsContent>
            <TabsContent value="search" className="mt-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Search & Understand Experiments</h2>
                    <p className="text-lg text-muted-foreground">
                       Query NASA's vast repository of space biology data. Get technical summaries, key metrics, and links to real publications and datasets.
                    </p>
                </div>
                <ExperimentSearch />
            </TabsContent>
        </Tabs>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AstroBio Explorer. Powered by AI.</p>
      </footer>
    </div>
  );
}
