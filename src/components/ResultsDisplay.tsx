import type { SearchResult } from '@/lib/types';
import K12Results from '@/components/K12Results';
import ProResults from '@/components/ProResults';
import ResultsSkeleton from '@/components/ResultsSkeleton';
import { Rocket } from 'lucide-react';

interface ResultsDisplayProps {
  isLoading: boolean;
  results: SearchResult | null;
}

export default function ResultsDisplay({ isLoading, results }: ResultsDisplayProps) {
  if (isLoading) {
    return <ResultsSkeleton />;
  }

  if (!results) {
    return (
      <div className="mt-16 text-center">
        <Rocket className="mx-auto h-16 w-16 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium text-muted-foreground">
          Your cosmic journey awaits
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Results from your query will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 animate-in fade-in duration-500">
      {results.mode === 'K-12' ? (
        <K12Results data={results} />
      ) : (
        <ProResults data={results} />
      )}
    </div>
  );
}
