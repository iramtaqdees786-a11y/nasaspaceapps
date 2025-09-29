import type { K12Result, Concept } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Lightbulb, BrainCircuit, Dna, Thermometer, ClipboardCheck, FlaskConical } from 'lucide-react';

interface K12ResultsProps {
  data: K12Result;
}

const iconMap: { [key: string]: React.ElementType } = {
  dna: Dna,
  thermometer: Thermometer,
  'clipboard-check': ClipboardCheck,
  'flask-conical': FlaskConical
};

function ConceptNode({ concept, isCentral = false }: { concept: Concept | { title: string }, isCentral?: boolean }) {
  const Icon = 'icon' in concept ? iconMap[concept.icon] : null;
  return (
    <Card className={`text-center shadow-lg transition-transform hover:scale-105 ${isCentral ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
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
  );
}

export default function K12Results({ data }: K12ResultsProps) {
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
        <h3 className="text-2xl font-bold text-center mb-6">Concept Map</h3>
        <div className="relative flex justify-center items-center p-8">
          <div className="absolute w-1/2 h-px bg-border top-1/2 left-0"></div>
          <div className="absolute w-1/2 h-px bg-border top-1/2 right-0"></div>
          <div className="absolute h-1/2 w-px bg-border left-1/2 top-0"></div>
          <div className="absolute h-1/2 w-px bg-border left-1/2 bottom-0"></div>
          
          <div className="w-48 z-10">
            <ConceptNode concept={{ title: data.conceptMap.centralTopic }} isCentral={true} />
          </div>

          <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-48">
            <ConceptNode concept={data.conceptMap.relatedConcepts[0]} />
          </div>
          <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 w-48">
            <ConceptNode concept={data.conceptMap.relatedConcepts[1]} />
          </div>
          <div className="absolute left-[-50px] top-1/2 -translate-y-1/2 w-48">
            <ConceptNode concept={data.conceptMap.relatedConcepts[2]} />
          </div>
          <div className="absolute right-[-50px] top-1/2 -translate-y-1/2 w-48">
            <ConceptNode concept={data.conceptMap.relatedConcepts[3]} />
          </div>
        </div>
      </div>
    </div>
  );
}
