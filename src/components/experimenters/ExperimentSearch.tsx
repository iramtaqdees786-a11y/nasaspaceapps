'use client';

import { useState, useTransition, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { ProResult } from '@/app/actions';
import { getExperimentData } from '@/app/actions';
import DocumentAnalysis from '@/components/DocumentAnalysis';
import ResultsSkeleton from '@/components/ResultsSkeleton';

export default function ExperimentSearch() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [results, setResults] = useState<ProResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const performSearch = useCallback((currentQuery: string) => {
    if (!currentQuery.trim()) {
      toast({
        title: "Search field is empty",
        description: "Please enter a topic to search for.",
        variant: "destructive",
      });
      return;
    }

    setSubmittedQuery(currentQuery);
    setResults(null);

    startTransition(async () => {
      try {
        const data = await getExperimentData(currentQuery, 'Pro');
        if (data.mode === 'Pro') {
          setResults(data);
        } else {
            throw new Error("Received unexpected data format.");
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
        });
      }
    });
  }, [toast]);

  const handleSearch = () => {
    performSearch(query);
  };

  return (
    <div className='space-y-8'>
      <div className="flex w-full items-center space-x-2">
        <Input
          type="text"
          placeholder="e.g., 'Rodent Research-1'"
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

      {isPending && <ResultsSkeleton />}

      {results && (
        <div className="mt-12 animate-in fade-in duration-500">
          <DocumentAnalysis data={results} query={submittedQuery} />
        </div>
      )}
    </div>
  );
}
