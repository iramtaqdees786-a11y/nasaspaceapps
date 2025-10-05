'use client';

import { useState, useTransition, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Keyboard } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

import AppHeader from '@/components/Header';
import ResultsDisplay from '@/components/ResultsDisplay';
import type { DailyFeature, SearchResult } from '@/app/actions';
import { getExperimentData, fetchDailyFeature } from '@/app/actions';

const searchSuggestions = [
  'tardigrades in space',
  'plant growth in microgravity',
  'rodent research on the ISS',
  'effects of cosmic radiation on DNA',
  'fruit fly experiments in space',
  'growing lettuce on the space station',
  'microbes on the ISS exterior',
  'astronaut muscle loss',
  'space-grown crystals for medicine',
  'salmonella virulence in space',
  'human microbiome in spaceflight',
];


export default function AstroBioExplorer() {
  const [mode, setMode] = useState<'K-12' | 'Pro'>('K-12');
  const [query, setQuery] = useState('');
  const [placeholder, setPlaceholder] = useState(searchSuggestions[0]);
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [dailyFeature, setDailyFeature] = useState<DailyFeature | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const suggestionIndex = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      suggestionIndex.current = (suggestionIndex.current + 1) % searchSuggestions.length;
      setPlaceholder(searchSuggestions[suggestionIndex.current]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadDailyFeature() {
      setDailyFeature(null);
      const feature = await fetchDailyFeature(mode);
      setDailyFeature(feature);
    }
    loadDailyFeature();
  }, [mode]);

  const performSearch = useCallback((currentQuery: string, searchMode: 'K-12' | 'Pro') => {
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
        const data = await getExperimentData(currentQuery, searchMode);
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
  }, [toast]);


  const handleSearch = () => {
    performSearch(query, mode);
  };
  
  const handleDailyFeatureSearch = (topic: string) => {
    setQuery(topic);
    performSearch(topic, mode);
  }

  const handleModeChange = (newMode: 'K-12' | 'Pro') => {
    setMode(newMode);
    // If there's a result, re-fetch for the new mode
    if (submittedQuery) {
        performSearch(submittedQuery, newMode);
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
    if (e.key === 'Tab' && placeholder) {
        e.preventDefault();
        setQuery(placeholder);
        performSearch(placeholder, mode);
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
              placeholder={`e.g., '${placeholder}'`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
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
           <div className="mt-2 text-xs text-muted-foreground flex items-center justify-center">
            Press
            <kbd className="mx-2 flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                <Keyboard className='h-3 w-3'/> Tab
            </kbd>
            to search for the suggested topic.
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
        <p>&copy; {new Date().getFullYear()} Cellestial. Powered by AI.</p>
      </footer>
    </div>
  );
}
