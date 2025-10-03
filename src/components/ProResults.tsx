'use client';

import type { ProResult, SourceDocument } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart as LineChartIcon, BarChart2, BookCopy, Database, FileDown, TestTube, ChevronsUp, MessageSquareQuote, Play, Volume2, Pause, Users, Calendar, Radiation } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useState, useTransition, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getAudioSummary, getPdfReportContent } from '@/app/actions';
import { Tooltip as ShadTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProResultsProps {
  data: ProResult;
  query: string;
}

function SectionCard({ title, icon, description, children, actions }: { title: string, icon: React.ReactNode, description?: string, children: React.ReactNode, actions?:React.ReactNode }) {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            {icon}
                            {title}
                        </CardTitle>
                        {description && <CardDescription className="mt-1">{description}</CardDescription>}
                    </div>
                    {actions && <div className="flex-shrink-0">{actions}</div>}
                </div>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

function AudioPlayer({ text }: { text: string }) {
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, startTransition] = useTransition();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { toast } = useToast();

    const handlePlayPause = async () => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
            return;
        }

        if (audioSrc) {
            audioRef.current?.play();
            setIsPlaying(true);
            return;
        }

        startTransition(async () => {
            try {
                const result = await getAudioSummary(text);
                setAudioSrc(result.media);
                const audio = new Audio(result.media);
                audioRef.current = audio;
                audio.play();
                audio.onended = () => setIsPlaying(false);
                setIsPlaying(true);
            } catch (error) {
                toast({
                    title: "Audio Error",
                    description: "Could not generate audio for the summary.",
                    variant: "destructive",
                });
            }
        });
    };
    const Icon = isPlaying ? Pause : Play;
    return (
        <Button variant="outline" size="sm" onClick={handlePlayPause} disabled={isLoading}>
            <Icon className="mr-2 h-4 w-4" />
            {isLoading ? 'Generating...' : (isPlaying ? 'Pause' : 'Listen')}
        </Button>
    );
}

function ResearchNavigator({ navigator }: { navigator: ProResult['researchNavigator'] }) {
    return (
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0 space-y-6">
             <SectionCard title="Related Studies" icon={<BookCopy className="h-5 w-5" />} description="From NASA Task Book">
                <ul className="space-y-3 text-sm">
                    {navigator.relatedStudies.map((study, i) => (
                        <li key={i} className="group">
                           <a href={study.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary group-hover:underline">{study.title}</a>
                           <p className="text-xs text-muted-foreground">Authors: {study.authors.join(', ')}</p>
                        </li>
                    ))}
                </ul>
            </SectionCard>
            <SectionCard title="Data Repositories" icon={<Database className="h-5 w-5" />} >
                <ul className="space-y-3 text-sm">
                    {navigator.dataRepositories.map((repo, i) => (
                        <li key={i} className="group">
                           <a href={repo.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary group-hover:underline">{repo.name}</a>
                           <p className="text-xs text-muted-foreground">{repo.description}</p>
                        </li>
                    ))}
                </ul>
            </SectionCard>
            <SectionCard title="Key Publications" icon={<MessageSquareQuote className="h-5 w-5" />} >
                <ul className="space-y-3 text-sm">
                    {navigator.keyPublications.map((pub, i) => (
                        <li key={i} className="group">
                           <a href={pub.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary group-hover:underline">{pub.title}</a>
                           <p className="text-xs text-muted-foreground">Authors: {pub.authors.join(', ')}</p>
                        </li>
                    ))}
                </ul>
            </SectionCard>
        </div>
    )
}

export default function ProResults({ data, query }: ProResultsProps) {
    const { toast } = useToast();
    const [isPdfLoading, startPdfTransition] = useTransition();

    const handleDownloadReport = () => {
        startPdfTransition(async () => {
            toast({
                title: "Generating Report",
                description: "This may take a minute. The download will start automatically."
            })
            try {
                const reportContent = await getPdfReportContent(query);
                // In a real app, you'd convert this JSON to a PDF.
                // For now, we'll download the JSON content.
                const blob = new Blob([JSON.stringify(reportContent, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${query.replace(/\s+/g, '_')}_report.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                 toast({
                    title: "Report Content Generated",
                    description: "Report data has been downloaded as a JSON file.",
                });
            } catch (error) {
                toast({ title: "Report Error", description: "Could not generate the report.", variant: "destructive" });
            }
        });
    }

    const renderSummaryWithCitations = (summary: string, sources: SourceDocument[]) => {
        const parts = summary.split(/(\[\d+\])/g);
        return parts.map((part, index) => {
            const match = part.match(/\[(\d+)\]/);
            if (match) {
                const sourceIndex = parseInt(match[1], 10) - 1;
                if (sources[sourceIndex]) {
                    const source = sources[sourceIndex];
                    return (
                        <TooltipProvider key={index}>
                            <ShadTooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">
                                        {part}
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-md bg-card text-card-foreground border-accent">
                                    <p className="font-bold">{source.title}</p>
                                    <p className="italic mt-2">"{source.snippet}"</p>
                                </TooltipContent>
                            </ShadTooltip>
                        </TooltipProvider>
                    );
                }
            }
            return part;
        });
    };

    const fullSummaryText = `${data.introduction}\n\n${data.summary}\n\n${data.conclusion}`;
    const keyMetricIcons: { [key: string]: React.ReactNode } = {
        'sample': <Users className="h-5 w-5 text-muted-foreground" />,
        'duration': <Calendar className="h-5 w-5 text-muted-foreground" />,
        'radiation': <Radiation className="h-5 w-5 text-muted-foreground" />,
    };

    const getMetricIcon = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('sample')) return keyMetricIcons.sample;
        if (lowerName.includes('duration')) return keyMetricIcons.duration;
        if (lowerName.includes('radiation')) return keyMetricIcons.radiation;
        return <TestTube className="h-5 w-5 text-muted-foreground" />;
    }

  return (
    <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-grow space-y-6">
            <SectionCard title="Technical Report" icon={<TestTube className="h-6 w-6" />} actions={
                <div className="flex items-center gap-2">
                    <AudioPlayer text={fullSummaryText} />
                    <Button variant="default" size="sm" onClick={handleDownloadReport} disabled={isPdfLoading}>
                        <FileDown className="mr-2 h-4 w-4" />
                        {isPdfLoading ? "Generating..." : "Generate Report"}
                    </Button>
                </div>
            }>
                <div className="space-y-4 text-base leading-relaxed">
                    <p><strong>Introduction:</strong> {data.introduction}</p>
                    <p>{renderSummaryWithCitations(data.summary, data.sources)}</p>
                    <div>
                        <h4 className="font-bold text-lg mb-2">Methodology</h4>
                        <p className="text-sm text-muted-foreground">{data.methodology}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-2">Future Research</h4>
                        <p className="text-sm text-muted-foreground">{data.futureResearch}</p>
                    </div>
                    <p><strong>Conclusion:</strong> {data.conclusion}</p>
                </div>
            </SectionCard>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {data.keyMetrics.map((metric) => (
                <Card key={metric.name}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardDescription>{metric.name}</CardDescription>
                        {getMetricIcon(metric.name)}
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {metric.value} <span className="text-sm font-normal text-muted-foreground">{metric.unit}</span>
                        </p>
                    </CardContent>
                </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="Data Visualization 1" icon={<BarChart2 className="h-6 w-6" />} description={data.barChart.description}>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.barChart.data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} label={{ value: data.barChart.xAxisLabel, position: 'insideBottom', offset: -5 }} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} yAxisId="left" orientation="left" stroke="#888888" label={{ value: data.barChart.yAxisLabel1, angle: -90, position: 'insideLeft' }} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: data.barChart.yAxisLabel2, angle: -90, position: 'insideRight' }} />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}/>
                                <Legend />
                                <Bar yAxisId="left" dataKey="value1" fill="hsl(var(--chart-1))" name={data.barChart.yAxisLabel1} />
                                <Bar yAxisId="right" dataKey="value2" fill="hsl(var(--chart-2))" name={data.barChart.yAxisLabel2} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </SectionCard>
                 <SectionCard title="Data Visualization 2" icon={<LineChartIcon className="h-6 w-6" />} description={data.areaChart.description}>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.areaChart.data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} label={{ value: data.areaChart.xAxisLabel, position: 'insideBottom', offset: -5 }} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}/>
                                <Legend />
                                <Area type="monotone" dataKey="value1" stackId="1" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" name={data.areaChart.yAxisLabel1} />
                                <Area type="monotone" dataKey="value2" stackId="1" stroke="hsl(var(--chart-4))" fill="hsl(var(--chart-4))" name={data.areaChart.yAxisLabel2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </SectionCard>
            </div>
        </div>
        <ResearchNavigator navigator={data.researchNavigator} />
    </div>
  );
}
