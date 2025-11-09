"use client";

import { BrainCircuit, ClipboardList, Combine, Truck, Factory, Archive, ShieldAlert, Loader2, Undo } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';

type Details = {
  searchQueriesUsed?: string[];
  keyInformationExtracted?: string[];
};

interface WorkflowStepProps {
  icon: string;
  agent: string;
  action: string;
  thought: string;
  details: Details;
  isLast?: boolean;
}

const iconMap: { [key: string]: React.ElementType } = {
  BrainCircuit,
  ClipboardList,
  Combine,
  Truck,
  Factory,
  Archive,
  ShieldAlert,
  Undo,
  Default: Loader2,
};

export function WorkflowStep({ icon, agent, action, thought, details, isLast = false }: WorkflowStepProps) {
  const IconComponent = iconMap[icon] || iconMap.Default;
  const hasDetails = details.searchQueriesUsed?.length || details.keyInformationExtracted?.length;

  return (
    <div className="relative pl-12 pb-8">
      {!isLast && (
        <div className="absolute left-[22px] top-5 h-full w-0.5 bg-slate-700" aria-hidden="true" />
      )}
      <div className="relative flex items-start space-x-4">
        <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center ring-8 ring-background">
          <IconComponent className="h-6 w-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1 pt-1.5">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
                <Card className="w-full bg-secondary/40 backdrop-blur-xl border border-border/30 shadow-xl rounded-xl overflow-hidden">
                    <AccordionTrigger className="p-4 hover:no-underline text-left [&[data-state=open]>div>svg]:rotate-180">
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-primary">{agent}</p>
                            <p className="mt-1 text-base font-medium text-slate-100 text-left">{action}</p>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <div className="p-4 bg-black/20 rounded-lg border border-slate-700 space-y-4">
                            <div>
                                <h4 className="font-semibold text-sm mb-1 text-slate-300">Thought Process</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{thought}</p>
                            </div>
                            
                            {hasDetails && <div className="border-t border-slate-600 my-2" />}

                            {details.searchQueriesUsed && details.searchQueriesUsed.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-sm mb-1 text-slate-300">Search Queries Used</h4>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                      {details.searchQueriesUsed.map((query, i) => <li key={i}>{query}</li>)}
                                    </ul>
                                </div>
                            )}
                            {details.keyInformationExtracted && details.keyInformationExtracted.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-sm mb-1 text-slate-300">Key Information Extracted</h4>
                                     <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                      {details.keyInformationExtracted.map((info, i) => <li key={i}>{info}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </AccordionContent>
                </Card>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
