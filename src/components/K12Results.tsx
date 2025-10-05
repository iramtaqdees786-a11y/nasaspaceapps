'use client';

import type { K12Result, Concept } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, BrainCircuit, Dna, Thermometer, ClipboardCheck, FlaskConical, Pencil, BookOpen, Ear, Video, Play, Volume2, Beaker, CheckCircle, XCircle, BookText, Rocket, Atom, Telescope, Sprout, ExternalLink, Pause } from 'lucide-react';
import { useState, useTransition, useEffect, useRef } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getAudioSummary } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';


interface K12ResultsProps {
  data: K12Result;
}

const iconMap: { [key: string]: React.ElementType } = {
  dna: Dna,
  thermometer: Thermometer,
  'clipboard-check': ClipboardCheck,
  'flask-conical': FlaskConical,
  pencil: Pencil,
  'book-open': BookOpen,
  ear: Ear,
  video: Video,
  beaker: Beaker,
  rocket: Rocket,
  atom: Atom,
  telescope: Telescope,
  sprout: Sprout
};

function ConceptNode({ concept, isCentral = false, style }: { concept: Concept | { title: string }, isCentral?: boolean, style?: React.CSSProperties }) {
  const Icon = 'icon' in concept && concept.icon ? iconMap[concept.icon] : null;
  const cardClasses = `text-center shadow-lg transition-transform hover:scale-105 w-36 h-36 flex flex-col justify-center ${isCentral ? 'bg-primary text-primary-foreground' : 'bg-card'}`;
  
  return (
    <div className="absolute" style={style}>
        <Card className={cardClasses}>
        <CardHeader className="pb-2">
            <div className="flex justify-center mb-2">
                {Icon && <Icon className="h-6 w-6" />}
            </div>
            <CardTitle className="text-sm font-bold">
                {concept.title}
            </CardTitle>
        </CardHeader>
        {'details' in concept && (
            <CardContent className="px-2 pb-2">
                <p className="text-xs text-muted-foreground">{concept.details}</p>
            </CardContent>
        )}
        </Card>
    </div>
  );
}

function LearningStrategy({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <Card className="shadow-md h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-accent">
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}

function MatchTheConceptsQuiz({ quiz }: { quiz: K12Result['quiz'] }) {
    const [shuffledDefs, setShuffledDefs] = useState([...quiz.definitions]);
    const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
    const [matches, setMatches] = useState<Record<string, string>>({});
    const [results, setResults] = useState<Record<string, boolean>>({});
    const [isFinished, setIsFinished] = useState(false);

    // Shuffle definitions whenever the quiz data changes
    useEffect(() => {
        setShuffledDefs([...quiz.definitions].sort(() => Math.random() - 0.5));
        setMatches({});
        setResults({});
        setSelectedConcept(null);
        setIsFinished(false);
    }, [quiz]);


    const handleConceptClick = (conceptId: string) => {
        if (isFinished || matches[conceptId]) return;
        setSelectedConcept(conceptId);
    };

    const handleDefinitionClick = (definitionId: string) => {
        if (isFinished || !selectedConcept || Object.values(matches).includes(definitionId)) return;
        
        const newMatches = {...matches, [selectedConcept]: definitionId };
        setMatches(newMatches);
        setSelectedConcept(null);
    };

    const checkAnswers = () => {
        const newResults: Record<string, boolean> = {};
        quiz.correctPairs.forEach(pair => {
            newResults[pair.conceptId] = matches[pair.conceptId] === pair.definitionId;
        });
        setResults(newResults);
        setIsFinished(true);
    };

    const resetQuiz = () => {
        setIsFinished(false);
        setSelectedConcept(null);
        setMatches({});
        setResults({});
        setShuffledDefs([...quiz.definitions].sort(() => Math.random() - 0.5));
    };
    
    const allMatched = Object.keys(matches).length === quiz.concepts.length;
    const score = Object.values(results).filter(Boolean).length;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-semibold text-muted-foreground text-center">Concepts</p>
                        {quiz.concepts.map(concept => (
                            <Button
                                key={concept.id}
                                variant={selectedConcept === concept.id ? "secondary" : "outline"}
                                className={cn(
                                    "h-auto justify-start text-left whitespace-normal py-2",
                                    isFinished && (results[concept.id] ? "border-green-500" : "border-red-500"),
                                    matches[concept.id] && !isFinished && "bg-accent/20"
                                )}
                                onClick={() => handleConceptClick(concept.id)}
                            >
                                {isFinished && (results[concept.id] ? <CheckCircle className="mr-2 text-green-500" /> : <XCircle className="mr-2 text-red-500" />)}
                                {concept.text}
                            </Button>
                        ))}
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-semibold text-muted-foreground text-center">Definitions</p>
                         {shuffledDefs.map(def => (
                            <Button
                                key={def.id}
                                variant="outline"
                                className={cn(
                                    "h-auto justify-start text-left whitespace-normal py-2",
                                    Object.values(matches).includes(def.id) && !isFinished && "bg-accent/20"
                                )}
                                onClick={() => handleDefinitionClick(def.id)}
                            >
                                {def.text}
                            </Button>
                        ))}
                    </div>
                </div>
                 <div className="mt-6 flex items-center justify-between">
                    {!isFinished ? (
                        <Button onClick={checkAnswers} disabled={!allMatched}>Check Answers</Button>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Button onClick={resetQuiz}>Play Again</Button>
                             <p className="font-bold text-lg">Your Score: {score}/{quiz.concepts.length}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function Glossary({ terms }: { terms: K12Result['glossary'] }) {
    if (!terms || terms.length === 0) return null;
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <BookText className="h-6 w-6" />
                    Glossary
                </CardTitle>
                <CardDescription>Key terms from the summary.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {terms.map(term => (
                        <li key={term.term} className="text-sm border-l-4 border-accent/50 pl-3">
                           <strong className="font-bold text-foreground">{term.term}:</strong> {term.definition}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}

function Sources({ sources }: { sources: K12Result['sources'] }) {
    if (!sources || sources.length === 0) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <BookOpen className="h-6 w-6" />
                    Sources
                </CardTitle>
                <CardDescription>The information was generated using these sources.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {sources.map(source => (
                        <li key={source.url}>
                            <Button asChild variant="link" className="p-0 h-auto text-base">
                                <Link href={source.url} target="_blank" rel="noopener noreferrer">
                                    {source.title}
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}

const learningStyleIcons: { [key: string]: React.ReactNode } = {
  Visual: <Video className="h-5 w-5" />,
  Auditory: <Ear className="h-5 w-5" />,
  'Reading/Writing': <Pencil className="h-5 w-5" />,
  Kinesthetic: <Dna className="h-5 w-5" />,
};

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
    
    let Icon, buttonText;
    if (isLoading) {
        Icon = Volume2;
        buttonText = 'Generating...';
    } else if (isPlaying) {
        Icon = Pause;
        buttonText = 'Pause';
    } else {
        Icon = Play;
        buttonText = 'Listen';
    }
    
    return (
        <Button variant="outline" size="sm" onClick={handlePlayPause} disabled={isLoading}>
            <Icon className="mr-2 h-4 w-4" />
            {buttonText}
        </Button>
    );
}

export default function K12Results({ data }: K12ResultsProps) {
    const fullSummary = `${data.introduction}\n\n${data.summary}\n\n${data.conclusion}`;
    
    const getHexPosition = (index: number, radius: number, total: number): React.CSSProperties => {
        const angle = (Math.PI / 3) * index;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        return {
            left: `calc(50% + ${x}px)`,
            top: `calc(50% + ${y}px)`,
            transform: 'translate(-50%, -50%)',
        };
    };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg overflow-hidden">
            <div className="relative p-6">
                <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl">Experiment Overview</CardTitle>
                    <AudioPlayer text={fullSummary} />
                </CardHeader>
                <CardContent className="p-0 pt-2 space-y-4 text-base leading-relaxed">
                    <p><strong className="font-semibold text-primary">Introduction:</strong> {data.introduction}</p>
                    <p>{data.summary}</p>
                    <p><strong className="font-semibold text-primary">Conclusion:</strong> {data.conclusion}</p>
                </CardContent>
            </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-accent">
              <Lightbulb className="h-6 w-6" />
              Fun Analogy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="italic">"{data.analogy}"</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-accent">
              <BrainCircuit className="h-6 w-6" />
              Memory Trick
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="italic">"{data.memoryTrick}"</p>
          </CardContent>
        </Card>
      </div>

       <Glossary terms={data.glossary} />

      <div>
        <h3 className="text-2xl font-bold text-center mb-6">Interactive Learning Center</h3>
        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
            <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl font-semibold">
                    <Pencil className="mr-2 h-6 w-6" />
                    Interactive Quiz
                </AccordionTrigger>
                <AccordionContent>
                    <MatchTheConceptsQuiz quiz={data.quiz} />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger className="text-xl font-semibold">
                    <BookOpen className="mr-2 h-6 w-6" />
                    Personalized Learning Styles
                </AccordionTrigger>
                <AccordionContent>
                     <div className="grid md:grid-cols-2 gap-4">
                        {data.learningStyles.map(ls => (
                            <LearningStrategy key={ls.style} title={ls.style} icon={learningStyleIcons[ls.style]}>
                                <p>{ls.suggestion}</p>
                            </LearningStrategy>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger className="text-xl font-semibold">
                    <Beaker className="mr-2 h-6 w-6" />
                    Hands-On Activities
                </AccordionTrigger>
                <AccordionContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        {data.activities.map(activity => (
                             <Card key={activity.title}>
                                <CardHeader>
                                    <CardTitle>{activity.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>{activity.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-center mb-6">Concept Map</h3>
        <div className="relative h-[450px] w-full max-w-3xl mx-auto my-12">
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {data.conceptMap.relatedConcepts.map((_, index) => {
                     const radius = 175;
                     const angle = (Math.PI / 3) * index;
                     const x2 = 50 + (radius / (450/2)) * Math.cos(angle) * 50;
                     const y2 = 50 + (radius / (450/2)) * Math.sin(angle) * 50;
                     return <line key={index} x1="50%" y1="50%" x2={`${x2}%`} y2={`${y2}%`} stroke="hsl(var(--border))" strokeDasharray="4" strokeWidth="2" />
                })}
            </svg>
            <div className="relative w-full h-full flex justify-center items-center">
                <ConceptNode concept={{ title: data.conceptMap.centralTopic }} isCentral={true} style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
                {data.conceptMap.relatedConcepts.map((concept, index) => (
                    <ConceptNode key={index} concept={concept} style={getHexPosition(index, 175, 6)} />
                ))}
            </div>
        </div>
      </div>

      <Sources sources={data.sources} />
    </div>
  );
}
