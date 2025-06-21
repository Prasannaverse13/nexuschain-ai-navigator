import { Logo } from '@/components/icons';

export function PageHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex gap-2 items-center">
          <Logo className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground font-headline">
            NexusChain AI Navigator
          </h1>
        </div>
      </div>
    </header>
  );
}
