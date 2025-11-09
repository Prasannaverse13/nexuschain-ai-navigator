"use client";

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { mainQuery, type MainQueryOutput } from '@/ai/flows/main-query-flow';

import { PageHeader } from '@/components/page-header';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Zap, RefreshCcw } from 'lucide-react';
import { WorkflowStep } from './workflow-step';
import { ReportDisplay } from './report-display';
import type { MainQueryInput } from '@/ai/flows/main-query-flow';
import { useToast } from '@/hooks/use-toast';
import { Footer } from './footer';

const formSchema = z.object({
  query: z.string().min(10, { message: 'Please enter a more detailed query.' }),
});

const placeholders = [
  "Analyze the supply chain for 'Electric Scooter Model Z' and identify key challenges.",
  "What are the best sourcing strategies for 'Lithium Batteries' in the EV Manufacturing industry?",
  "Describe the typical delivery process for 'perishable goods' in 'Southeast Asia'.",
  "How does 'Agile SCM' differ from 'Lean SCM' in practice?",
];

const loadingMessages = [
  "NexusChain AI is processing your request...",
  "Manager Agent: Analyzing query and delegating tasks...",
  "Planning Agent: Searching for market demand data...",
  "Sourcing Agent: Analyzing global trade reports...",
  "Delivery Agent: Investigating logistics challenges...",
  "Manager Agent: Compiling results and synthesizing the final report...",
];

export function MainPage() {
  const [placeholder, setPlaceholder] = useState(placeholders[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const { toast } = useToast();
  
  const [fullResult, setFullResult] = useState<MainQueryOutput | null>(null);
  const [displayedWorkflow, setDisplayedWorkflow] = useState<MainQueryOutput['workflow']>([]);
  const [finalReport, setFinalReport] = useState<MainQueryOutput['report'] | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: '' },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder((prev) => {
        const currentIndex = placeholders.indexOf(prev);
        const nextIndex = (currentIndex + 1) % placeholders.length;
        return placeholders[nextIndex];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[i]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);
  
  useEffect(() => {
    if (fullResult) {
      setDisplayedWorkflow([]);
      setFinalReport(null);

      // Animate workflow steps
      fullResult.workflow.forEach((step, index) => {
        setTimeout(() => {
          setDisplayedWorkflow(prev => [...prev, step]);
          // After the last workflow step, show the report
          if (index === fullResult.workflow.length - 1) {
            setTimeout(() => {
              setFinalReport(fullResult.report);
              resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 750);
          }
        }, index * 1200);
      });
    }
  }, [fullResult]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setFullResult(null);
    setDisplayedWorkflow([]);
    setFinalReport(null);
    setLoadingMessage(loadingMessages[0]);
    
    try {
      const response = await mainQuery(values as MainQueryInput);
      setFullResult(response);
    } catch (error) {
      console.error("Error processing query:", error);
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Failed to process the request. Please try again.",
      })
    } finally {
      setIsLoading(false);
    }
  }

  const handleNewQuery = () => {
    form.reset({ query: '' });
    setFullResult(null);
    setDisplayedWorkflow([]);
    setFinalReport(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <PageHeader />
      <main className="flex-grow flex flex-1 flex-col items-center gap-8 p-4 md:p-8">
        <div className="w-full max-w-3xl flex flex-col items-center text-center mt-8 md:mt-16">
          <h1 className="text-3xl md:text-5xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-br from-slate-200 to-slate-400 py-2">The Unified Supply Chain Brain</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Ask a question or set a goal about your product's supply chain. NexusChain AI will orchestrate the right agents to find the optimal solution.
          </p>
        </div>
        
        <Card className="w-full max-w-3xl bg-secondary/40 backdrop-blur-xl border border-border/30 shadow-2xl rounded-2xl">
          <CardContent className="p-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Textarea
                {...form.register('query')}
                placeholder={placeholder}
                className="w-full h-24 text-base resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none bg-transparent placeholder:text-muted-foreground text-foreground"
                disabled={isLoading}
              />
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  {(fullResult || finalReport) && !isLoading && (
                    <Button variant="ghost" onClick={handleNewQuery}>
                      <RefreshCcw className="mr-2 h-4 w-4" /> New Query
                    </Button>
                  )}
                </div>
                <Button type="submit" disabled={isLoading} size="lg" className="rounded-xl">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Analyze Supply Chain
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div ref={resultsRef} className="w-full max-w-3xl space-y-8 pb-16">
          {isLoading && (
            <div className="flex flex-col items-center gap-4 text-center p-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg font-medium text-muted-foreground">{loadingMessage}</p>
            </div>
          )}

          {displayedWorkflow.length > 0 && (
            <div className="animate-in fade-in-0 duration-500">
              <h2 className="text-2xl font-headline font-semibold mb-4 ml-2 text-slate-100">Agent Workflow</h2>
              <div className="space-y-0">
                  {displayedWorkflow.map((step, index) => (
                      <WorkflowStep
                          key={index}
                          agent={step.agent}
                          icon={step.icon}
                          action={step.action}
                          thought={step.thought}
                          details={step.details}
                          isLast={index === (fullResult?.workflow.length ?? 0) - 1}
                      />
                  ))}
              </div>
            </div>
          )}

          {finalReport && (
             <div className="animate-in fade-in-0 duration-500">
               <ReportDisplay report={finalReport} />
             </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
