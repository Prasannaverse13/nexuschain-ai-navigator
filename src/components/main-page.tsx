"use client";

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { mainQuery, type MainQueryOutput } from '@/ai/flows/main-query-flow';

import { PageHeader } from '@/components/page-header';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Zap, Lightbulb } from 'lucide-react';
import { WorkflowStep } from './workflow-step';
import type { MainQueryInput } from '@/ai/flows/main-query-flow';

const formSchema = z.object({
  query: z.string().min(10, { message: 'Please enter a more detailed query.' }),
});

const placeholders = [
  "Optimize my Q3 product line for maximum profit.",
  "Investigate the recent rise in steel prices and its impact on production.",
  "Plan a new delivery route for urgent shipment #XYZ considering current weather.",
  "Forecast demand for Product Alpha for the next 6 months and suggest procurement actions.",
];

const loadingMessages = [
  "NexusChain AI is processing your request...",
  "Orchestrating agents...",
  "Demand Forecasting Agent initiated...",
  "Procurement Agent analyzing market data...",
  "Logistics Agent calculating routes...",
  "Compiling results...",
];

export function MainPage() {
  const [placeholder, setPlaceholder] = useState(placeholders[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  
  const [fullResult, setFullResult] = useState<MainQueryOutput | null>(null);
  const [displayedWorkflow, setDisplayedWorkflow] = useState<MainQueryOutput['workflow']>([]);
  const [finalSummary, setFinalSummary] = useState<MainQueryOutput | null>(null);

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
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[i]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);
  
  useEffect(() => {
    if (fullResult) {
      // Clear previous results before starting new animation
      setDisplayedWorkflow([]);
      setFinalSummary(null);

      // Animate workflow steps
      fullResult.workflow.forEach((step, index) => {
        setTimeout(() => {
          setDisplayedWorkflow(prev => [...prev, step]);
          // If it's the last step, show the final summary after a short delay
          if (index === fullResult.workflow.length - 1) {
            setTimeout(() => {
              setFinalSummary(fullResult);
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
    setFinalSummary(null);
    setLoadingMessage(loadingMessages[0]);
    
    try {
      const response = await mainQuery(values as MainQueryInput);
      setFullResult(response);
    } catch (error) {
      console.error("Error processing query:", error);
      // Here you would use a toast to show the error
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <PageHeader />
      <main className="flex flex-1 flex-col items-center gap-8 p-4 md:p-8">
        <div className="w-full max-w-3xl flex flex-col items-center text-center mt-8 md:mt-16">
          <h1 className="text-3xl md:text-5xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-br from-slate-200 to-slate-400 py-2">The Unified Supply Chain Brain</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Ask a question or set a goal. NexusChain AI will orchestrate the right agents to find the optimal solution for your supply chain.
          </p>
        </div>
        
        <Card className="w-full max-w-3xl bg-background/50 backdrop-blur-lg border border-border/30 shadow-2xl rounded-2xl">
          <CardContent className="p-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Textarea
                {...form.register('query')}
                placeholder={placeholder}
                className="w-full h-24 text-base resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none bg-transparent placeholder:text-muted-foreground text-foreground"
                disabled={isLoading}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} size="lg" className="rounded-xl">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Optimize
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

          {finalSummary && (
            <div className="animate-in fade-in-0 duration-500 space-y-8">
               <Card className="bg-background/50 backdrop-blur-lg border border-border/30 shadow-2xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-headline text-slate-100">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-slate-300">{finalSummary.summary}</p>
                </CardContent>
              </Card>

              <Card className="bg-background/50 backdrop-blur-lg border border-border/30 shadow-2xl rounded-2xl">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Lightbulb className="h-6 w-6 text-accent" />
                        <CardTitle className="text-xl font-headline text-slate-100">Key Recommendations</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc pl-5 text-slate-300">
                    {finalSummary.recommendations.map((rec, index) => (
                      <li key={index} className="text-base">{rec}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
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
                          details={step.details}
                          isLast={index === (fullResult?.workflow.length ?? 0) - 1}
                      />
                  ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
