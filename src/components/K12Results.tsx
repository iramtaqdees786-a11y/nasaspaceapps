import type { K12Result, Concept } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Lightbulb, BrainCircuit, Dna, Thermometer, ClipboardCheck, FlaskConical, Pencil, BookOpen, Ear, Video, Play, Volume2, Beaker, CheckCircle, XCircle } from 'lucide-react';
import { useState, useTransition, useMemo, useCallback } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getAudioSummary } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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
};

function ConceptNode({ concept, isCentral = false, position }: { concept: Concept | { title: string }, isCentral?: boolean, position?: string }) {
  const Icon = 'icon' in concept ? iconMap[concept.icon] : null;
  const cardClasses = `text-center shadow-lg transition-transform hover:scale-105 w-48 ${isCentral ? 'bg-primary text-primary-foreground' : 'bg-card'}`;
  
  const positions: { [key: string]: string } = {
      'top': "top-0 left-1/2 -translate-x-1/2 -translate-y-full",
      'bottom': "bottom-0 left-1/2 -translate-x-1/2 translate-y-full",
      'left': "left-0 top-1/2 -translate-y-1/2 -translate-x-full",
      'right': "right-0 top-1/2 -translate-y-1/2 translate-x-full",
  };
  const posClass = positions[position || 'top'];

  return (
    <div className={`absolute ${posClass}`}>
        <Card className={cardClasses}>
        <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center justify-center gap-2">
            {Icon && <Icon className="h-5 w-5" />}
            {concept.title}
            </CardTitle>
        </CardHeader>
        {'details' in concept && (
            <CardContent>
            <p className="text-sm text-muted-foreground">{concept.details}</p>
            </CardContent>
        )}
        </Card>
    </div>
  );
}

function LearningStrategy({ title, icon, children }: { title: string, icon: string, children: React.ReactNode }) {
    const Icon = iconMap[icon];
    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-accent">
                    {Icon && <Icon className="h-5 w-5" />}
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
    const [shuffledDefs, setShuffledDefs] = useState(() => [...quiz.definitions].sort(() => Math.random() - 0.5));
    const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
    const [matches, setMatches] = useState<Record<string, string>>({});
    const [results, setResults] = useState<Record<string, boolean>>({});
    const [isFinished, setIsFinished] = useState(false);

    const handleConceptClick = (conceptId: string) => {
        if (isFinished) return;
        if (matches[conceptId]) return;
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
        setMatches({});
        setResults({});
        setSelectedConcept(null);
        setIsFinished(false);
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
                <div className="grid grid-cols-2 gap-4 md:gap-8">
                    {/* Concepts Column */}
                    <div className="flex flex-col gap-2">
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
                    {/* Definitions Column */}
                    <div className="flex flex-col gap-2">
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

export default function K12Results({ data }: K12ResultsProps) {
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [isAudioLoading, startAudioTransition] = useTransition();
    const { toast } = useToast();

    const handlePlayAudio = () => {
        if (audioSrc) {
            const audio = new Audio(audioSrc);
            audio.play();
            return;
        }

        startAudioTransition(async () => {
            try {
                const result = await getAudioSummary(data.summary);
                setAudioSrc(result.media);
                const audio = new Audio(result.media);
                audio.play();
            } catch (error) {
                 toast({
                    title: "Audio Error",
                    description: "Could not generate audio for the summary.",
                    variant: "destructive",
                });
            }
        });
    };
    
    const conceptPositions = ["top", "right", "bottom", "left"];

  return (
    <div className="space-y-8">
      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between bg-muted/30">
          <CardTitle className="text-2xl">Experiment Summary</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePlayAudio} disabled={isAudioLoading}>
                {isAudioLoading ? 'Loading...' : (audioSrc ? <Volume2 className="mr-2 h-4 w-4"/> : <Play className="mr-2 h-4 w-4" />)}
                Listen
            </Button>
            <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-base leading-relaxed">{data.summary}</p>
        </CardContent>
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

      <div>
        <h3 className="text-2xl font-bold text-center mb-6">Learning Strategies</h3>
        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Pencil className="h-6 w-6" />
                        Interactive Quiz
                    </CardTitle>
                </AccordionTrigger>
                <AccordionContent>
                    <MatchTheConceptsQuiz quiz={data.quiz} />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <BookOpen className="h-6 w-6" />
                        Learning Styles
                    </CardTitle>
                </AccordionTrigger>
                <AccordionContent>
                     <div className="grid md:grid-cols-2 gap-4">
                        <LearningStrategy title="Visual" icon="video">
                            <p>Try drawing diagrams of the experiment setup or findings.</p>
                        </LearningStrategy>
                        <LearningStrategy title="Auditory" icon="ear">
                            <p>Read the summary aloud or discuss it with a friend.</p>
                        </LearningStrategy>
                        <LearningStrategy title="Reading/Writing" icon="pencil">
                            <p>Write your own summary or create flashcards for key terms.</p>
                        </LearningStrategy>
                        <LearningStrategy title="Kinesthetic" icon="dna">
                            <p>Build a simple model of the experiment if possible.</p>
                        </LearningStrategy>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Beaker className="h-6 w-6" />
                        Activities
                    </CardTitle>
                </AccordionTrigger>
                <AccordionContent>
                    <Card>
                        <CardContent className="pt-6 grid gap-4">
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-bold">Home Experiment</h4>
                                <p>Try growing a bean seed in a plastic bag with a wet paper towel. Place one in a dark closet and one near a window. Compare them after a week. How is this like growing plants in space vs. on Earth?</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-bold">Creative Writing</h4>
                                <p>Write a short story from the perspective of a plant traveling to space for the first time. What does it see? How does it feel different?</p>
                            </div>
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-center mb-12">Concept Map</h3>
        <div className="relative h-96 w-full max-w-3xl mx-auto my-24">
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <line x1="50%" y1="50%" x2="50%" y2="0" stroke="hsl(var(--border))" strokeDasharray="4" strokeWidth="2" />
                <line x1="50%" y1="50%" x2="100%" y2="50%" stroke="hsl(var(--border))" strokeDasharray="4" strokeWidth="2" />
                <line x1="50%" y1="50%" x2="50%" y2="100%" stroke="hsl(var(--border))" strokeDasharray="4" strokeWidth="2" />
                <line x1="50%" y1="50%" x2="0" y2="50%" stroke="hsl(var(--border))" strokeDasharray="4" strokeWidth="2" />
            </svg>
            <div className="relative w-full h-full flex justify-center items-center">
                <ConceptNode concept={{ title: data.conceptMap.centralTopic }} isCentral={true} />
                {data.conceptMap.relatedConcepts.map((concept, index) => (
                    <ConceptNode key={index} concept={concept} position={conceptPositions[index % conceptPositions.length]} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
