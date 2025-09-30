import type { ProResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Download, FileText, Database, Milestone, FileImage, FileDown } from 'lucide-react';
import { Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer, BarChart as RechartsBarChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';

interface ProResultsProps {
  data: ProResult;
}

const chartConfig = {
  growth: {
    label: "Growth (%)",
    color: "hsl(var(--chart-1))",
  },
  radiation: {
    label: "Radiation (mSv)",
    color: "hsl(var(--chart-2))",
  },
};

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
