'use client';

import type { DailyFeature, SearchResult } from '@/app/actions';
import K12Results from '@/components/K12Results';
import ProResults from '@/components/ProResults';
import ResultsSkeleton from '@/components/ResultsSkeleton';
import { Rocket, Sparkles, Brain, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface ResultsDisplayProps {
  isLoading: boolean;
  results: SearchResult | null;
  dailyFeature: DailyFeature | null;
  onDiveDeeper: (topic: string) => void;
  mode: 'K-12' | 'Pro';
  query: string;
}

function DailyFeatureCard({ 
  feature, 
  onDiveDeeper,
  mode 
}: { 
  feature: DailyFeature | null;
  onDiveDeeper: (topic: string) => void;
  mode: 'K-12' | 'Pro';
}) {
  if (!feature) return null;

  const Icon = feature.title.includes('Fun Fact') ? Sparkles : Brain;
  const buttonText = mode === 'K-12' ? 'Learn more about it!' : 'Dive Deep';

  return (
    <Card className="my-8 bg-accent/10 border-accent/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent">
          <Icon className="h-6 w-6" />
          {feature.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{feature.content}</p>
         <Button variant="ghost" className="text-accent hover:text-accent-foreground" onClick={() => onDiveDeeper(feature.content)}>
          {buttonText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default function ResultsDisplay({ isLoading, results, dailyFeature, onDiveDeeper, mode, query }: ResultsDisplayProps) {
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
        <DailyFeatureCard feature={dailyFeature} onDiveDeeper={onDiveDeeper} mode={mode} />
      </div>
    );
  }

  return (
    <div className="mt-12 animate-in fade-in duration-500">
      {results.mode === 'K-12' ? (
        <K12Results data={results} />
      ) : (
        <ProResults data={results} query={query} />
      )}
    </div>
  );
}
