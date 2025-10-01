'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

import AppHeader from '@/components/Header';
import ResultsDisplay from '@/components/ResultsDisplay';
import type { DailyFeature, SearchResult } from '@/app/actions';
import { getExperimentData, fetchDailyFeature } from '@/app/actions';

export default function AstroBioExplorer() {
  const [mode, setMode] = useState<'K-12' | 'Pro'>('K-12');
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [dailyFeature, setDailyFeature] = useState<DailyFeature | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function loadDailyFeature() {
      setDailyFeature(null);
      const feature = await fetchDailyFeature(mode);
      setDailyFeature(feature);
    }
    loadDailyFeature();
  }, [mode]);

  const performSearch = useCallback((currentQuery: string) => {
    if (!currentQuery.trim()) {
      toast({
        title: "Search field is empty",
        description: "Please enter a topic to search for.",
        variant: "destructive",
      })
      return;
    }
    
    setSubmittedQuery(currentQuery);
    setResults(null);

    startTransition(async () => {
      try {
        const data = await getExperimentData(currentQuery, mode);
        setResults(data);
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
  }, [mode, toast]);


  const handleSearch = () => {
    performSearch(query);
  };
  
  const handleDailyFeatureSearch = (topic: string) => {
    setQuery(topic);
    performSearch(topic);
  }

  const handleModeChange = (newMode: 'K-12' | 'Pro') => {
    setMode(newMode);
    // If there's a result, re-fetch for the new mode
    if (submittedQuery) {
        performSearch(submittedQuery);
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <AppHeader mode={mode} setMode={handleModeChange} />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Explore NASA's Space Biology</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Ask about experiments, organisms, and findings. Select a mode for a tailored experience.
          </p>
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="e.g., 'plant growth in microgravity'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="text-base"
              aria-label="Search for space biology experiments"
            />
            <Button 
              type="submit" 
              onClick={handleSearch} 
              disabled={isPending}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <ResultsDisplay 
          isLoading={isPending} 
          results={results} 
          dailyFeature={dailyFeature} 
          onDiveDeeper={handleDailyFeatureSearch}
          mode={mode}
          query={submittedQuery}
        />
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AstroBio Explorer. Powered by AI.</p>
      </footer>
    </div>
  );
}
