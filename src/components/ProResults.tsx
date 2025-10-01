import type { ProResult, SourceDocument } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Download, FileText, Database, Milestone, FileImage, FileDown, TestTube, ChevronsUp, MessageSquareQuote } from 'lucide-react';
import Image from 'next/image';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

interface ProResultsProps {
  data: ProResult;
}

function SectionCard({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
}

function SourceList({ sources }: { sources: SourceDocument[] }) {
    if (!sources || sources.length === 0) return null;

    return (
        <SectionCard title="Sources" icon={<MessageSquareQuote className="h-6 w-6" />}>
            <div className="space-y-4">
                {sources.map((source, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-muted/50">
                        <h4 className="font-bold mb-1">
                            <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                {source.title}
                            </a>
                        </h4>
                        <blockquote className="border-l-4 border-accent pl-3 italic text-muted-foreground">
                            "{source.snippet}"
                        </blockquote>
                    </div>
                ))}
            </div>
        </SectionCard>
    );
}


export default function ProResults({ data }: ProResultsProps) {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Technical Summary</CardTitle>
          <a href={data.pdfUrl} download="report.pdf">
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              Download Report (PDF)
            </Button>
          </a>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed whitespace-pre-wrap">{data.summary}</p>
        </CardContent>
      </Card>

       <div className="grid md:grid-cols-3 gap-6">
        {data.keyMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="pb-2">
              <CardDescription>{metric.name}</CardDescription>
              <CardTitle className="text-3xl">
                {metric.value} <span className="text-sm font-normal text-muted-foreground">{metric.unit}</span>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <SectionCard title="Methodology" icon={<TestTube className="h-6 w-6" />}>
            <p className="text-sm text-muted-foreground">{data.methodology}</p>
        </SectionCard>
         <SectionCard title="Future Research" icon={<ChevronsUp className="h-6 w-6" />}>
            <p className="text-sm text-muted-foreground">{data.futureResearch}</p>
        </SectionCard>
      </div>

      <SourceList sources={data.sources} />
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BarChart className="h-6 w-6" />
            Data Visualization
          </CardTitle>
          <CardDescription>{data.chartDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="aspect-video w-full rounded-lg border overflow-hidden">
                 <Image src={data.chartImageUrl} alt="Data Visualization Chart" width={800} height={400} className="object-cover" />
            </div>
            <a href={data.chartImageUrl} download="chart.png">
                <Button variant="outline" size="sm">
                    <FileImage className="mr-2 h-4 w-4" />
                    Download Chart (PNG)
                </Button>
            </a>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-6 w-6" />
              Related Publications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Authors</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.publications.map((pub) => (
                  <TableRow key={pub.title}>
                    <TableCell><a href={pub.url} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{pub.title}</a></TableCell>
                    <TableCell>{pub.authors.join(', ')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Database className="h-6 w-6" />
              Data Repositories
            </CardTitle>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.datasets.map((dataset) => (
                   <TableRow key={dataset.name}>
                    <TableCell><a href={dataset.url} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{dataset.name}</a></TableCell>
                    <TableCell>{dataset.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
