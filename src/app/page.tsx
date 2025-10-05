import { Button } from '@/components/ui/button';
import { Rocket, Telescope, Dna, FileCheck, Keyboard } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Rocket className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">
              AstroBio Explorer
            </h1>
          </div>
          <nav className="flex items-center gap-4">
            <Button asChild variant="ghost">
                <Link href="/explorer">Explorer</Link>
            </Button>
            <Button asChild variant="ghost">
                <Link href="/experimenters">Experimenters</Link>
            </Button>
            <Button asChild>
                <Link href="/explorer">Launch App</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-16 md:py-24 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
          Uncover the Secrets of Life in Space
        </h2>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-12">
          Your AI-powered portal to NASA's vast repository of space biology experiments. Explore cutting-edge research, from microbes to mammals, and witness the future of extraterrestrial life.
        </p>
        <div className="flex justify-center">
          <Button asChild size="lg" className="text-lg">
            <Link href="/explorer">
              <Rocket className="mr-2" />
              Start Exploring Now
            </Link>
          </Button>
        </div>
      </main>

      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            <div className="flex flex-col items-center">
              <Telescope className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-2xl font-bold mb-2">For Researchers</h3>
              <p className="text-muted-foreground">
                Access technical summaries, key metrics, and links to publications and datasets.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Dna className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-2xl font-bold mb-2">For Students</h3>
              <p className="text-muted-foreground">
                Learn with fun analogies, interactive quizzes, and easy-to-understand summaries.
              </p>
            </div>
            <div className="flex flex-col items-center">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-accent mb-4"><path d="m12 14 4-4"/><path d="M12 14v4"/><path d="M10.5 7.5a3.5 3.5 0 1 1-5 0 3.5 3.5 0 0 1 5 0Z"/><path d="M17.5 7.5a3.5 3.5 0 1 1-5 0 3.5 3.5 0 0 1 5 0Z"/><path d="M14 14h4"/><path d="m18 18-4-4"/><path d="m6 18 4-4"/></svg>
              <h3 className="text-2xl font-bold mb-2">AI-Powered</h3>
              <p className="text-muted-foreground">
                Leverages generative AI to synthesize and present information in a tailored format.
              </p>
            </div>
            <div className="flex flex-col items-center">
                <FileCheck className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-2xl font-bold mb-2">Analyze Documents</h3>
                <p className="text-muted-foreground">
                    Upload your own research papers and get an AI-powered breakdown and analysis.
                </p>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AstroBio Explorer. Your cosmic journey begins here.</p>
      </footer>
    </div>
  );
}
