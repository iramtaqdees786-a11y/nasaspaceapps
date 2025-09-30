'use client';

import type { Dispatch, SetStateAction } from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Logo from '@/components/Logo';
import { GraduationCap, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


interface AppHeaderProps {
  mode: 'K-12' | 'Pro';
  setMode: Dispatch<SetStateAction<'K-12' | 'Pro'>>;
}

export default function AppHeader({ mode, setMode }: AppHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            AstroBio Explorer
          </h1>
        </Link>
        {pathname === '/explorer' && (
          <ToggleGroup 
            type="single" 
            value={mode} 
            onValueChange={(value) => {
              if (value) setMode(value as 'K-12' | 'Pro')
            }}
            aria-label="Select user mode"
          >
            <ToggleGroupItem value="K-12" aria-label="K-12 Mode">
              <GraduationCap className="h-4 w-4 mr-2" />
              K-12
            </ToggleGroupItem>
            <ToggleGroupItem value="Pro" aria-label="Pro Mode">
              <Briefcase className="h-4 w-4 mr-2" />
              Pro
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      </div>
    </header>
  );
}
