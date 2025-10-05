'use client';

import type { Dispatch, SetStateAction } from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Logo from '@/components/Logo';
import { GraduationCap, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';


interface AppHeaderProps {
  mode: 'K-12' | 'Pro';
  setMode: (newMode: 'K-12' | 'Pro') => void;
}

export default function AppHeader({ mode, setMode }: AppHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3" prefetch={false}>
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            <span className="text-primary">Cell</span>estial
          </h1>
        </Link>
        
        <nav className="hidden md:flex items-center gap-2">
            <Button asChild variant={pathname === '/explorer' ? 'secondary' : 'ghost'} prefetch={false}>
                <Link href="/explorer" prefetch={false}>Explorer</Link>
            </Button>
            <Button asChild variant={pathname === '/experimenters' ? 'secondary' : 'ghost'} prefetch={false}>
                <Link href="/experimenters" prefetch={false}>Experimenters</Link>
            </Button>
        </nav>

        {pathname === '/explorer' ? (
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
        ) : <div className='w-44'/>}
      