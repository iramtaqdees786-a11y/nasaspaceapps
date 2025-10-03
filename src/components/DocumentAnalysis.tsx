'use client';

import type { ProResult } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProResults from '@/components/ProResults';

interface DocumentAnalysisProps {
  data: ProResult;
  query: string;
}

export default function DocumentAnalysis({ data, query }: DocumentAnalysisProps) {
  return (
    <Card className="shadow-lg overflow-hidden">
        <CardHeader>
            <CardTitle className="text-2xl">Analysis of: <span className="text-primary">{query}</span></CardTitle>
        </CardHeader>
        <CardContent>
            <ProResults data={data} query={query} />
        </CardContent>
    </Card>
  );
}
