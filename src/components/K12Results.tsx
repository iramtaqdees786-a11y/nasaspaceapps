import type { K12Result, Concept } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Lightbulb, BrainCircuit, Dna, Thermometer, ClipboardCheck, FlaskConical, Pencil, BookOpen, Ear, Video } from 'lucide-react';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
  video: Video
};

function ConceptNode({ concept, isCentral = false, position }: { concept: Concept | { title: string }, isCentral?: boolean, position?: string }) {
  const Icon = 'icon' in concept ? iconMap[concept.icon] : null;
  return (
    <div className={`absolute ${position}`}>
        <Card className={`text-center shadow-lg transition-transform hover:scale-105 w-48 ${isCentral ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
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

function Quiz({ question, answer, onAnswer }: { question: string, answer: string, onAnswer: (isCorrect: boolean) => void }) {
    const [selected, setSelected] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const options = [answer, "A different answer", "Another choice"]; // Simple mock options
    const shuffledOptions = options.sort(() => Math.random() - 0.5);

    const handleSubmit = () => {
        if (selected === null) return;
        setSubmitted(true);
        onAnswer(selected === answer);
    };

    return (
        <div className="space-y-3">
            <p className="font-semibold">{question}</p>
            <div className="flex flex-col gap-2">
                {shuffledOptions.map((opt, i) => (
                    <Button
                        key={i}
                        variant={submitted && opt === answer ? 'default' : submitted && opt === selected ? 'destructive' : 'outline'}
                        onClick={() => !submitted && setSelected(opt)}
                        className="justify-start"
                    >
                        {opt}
                    </Button>
                ))}
            </div>
            <Button onClick={handleSubmit} disabled={submitted || selected === null}>Check Answer</Button>
        </div>
    );
}

export default function K12Results({ data }: K12ResultsProps) {
    const [quizResult, setQuizResult] = useState<boolean | null>(null);
    
    const positions = [
        "top-0 left-1/2 -translate-x-1/2",
        "bottom-0 left-1/2 -translate-x-1/2",
        "left-0 top-1/2 -translate-y-1/2",
        "right-0 top-1/2 -translate-y-1/2",
    ];

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Experiment Summary</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </CardHeader>
        <CardContent>
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
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Pencil className="h-6 w-6" />
                        Interactive Quiz
                    </CardTitle>
                </AccordionTrigger>
                <AccordionContent>
                    <Card>
                        <CardContent className="pt-6">
                            <Quiz
                                question={`What is the main topic of the experiment "${data.conceptMap.centralTopic}"?`}
                                answer="The experiment's main focus."
                                onAnswer={setQuizResult}
                            />
                            {quizResult !== null && (
                                <p className={`mt-4 font-bold ${quizResult ? 'text-green-500' : 'text-red-500'}`}>
                                    {quizResult ? "Correct! Great job!" : "Not quite, try again or review the summary."}
                                </p>
                            )}
                        </CardContent>
                    </Card>
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
        </Accordion>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-center mb-6">Concept Map</h3>
        <div className="relative h-96 w-full max-w-2xl mx-auto my-16">
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <line x1="50%" y1="25%" x2="50%" y2="50%" stroke="hsl(var(--border))" strokeWidth="2" />
                <line x1="50%" y1="75%" x2="50%" y2="50%" stroke="hsl(var(--border))" strokeWidth="2" />
                <line x1="25%" y1="50%" x2="50%" y2="50%" stroke="hsl(var(--border))" strokeWidth="2" />
                <line x1="75%" y1="50%" x2="50%" y2="50%" stroke="hsl(var(--border))" strokeWidth="2" />
            </svg>
            <div className="relative w-full h-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <ConceptNode concept={{ title: data.conceptMap.centralTopic }} isCentral={true} />
                </div>
                {data.conceptMap.relatedConcepts.map((concept, index) => (
                    <ConceptNode key={index} concept={concept} position={positions[index]} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
