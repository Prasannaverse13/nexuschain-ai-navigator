"use client";

import { BarChartBig, AlertTriangle, ShoppingCart, Truck, Loader2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface WorkflowStepProps {
  icon: string;
  agent: string;
  action: string;
  details: string;
  classification?: string;
  confidence?: number;
  summary?: string;
  isLast?: boolean;
}

const iconMap: { [key: string]: React.ElementType } = {
  BarChartBig,
  AlertTriangle,
  ShoppingCart,
  Truck,
  Default: Loader2,
};

export function WorkflowStep({ icon, agent, action, details, classification, confidence, summary, isLast = false }: WorkflowStepProps) {
  const IconComponent = iconMap[icon] || iconMap.Default;

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
                                <h4 className="font-semibold text-sm mb-1 text-slate-300">Details</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{details}</p>
                            </div>
                            {classification && (
                                <div>
                                    <h4 className="font-semibold text-sm mb-1 text-slate-300">Classification</h4>
                                    <p className="text-sm text-muted-foreground">{classification}</p>
                                </div>
                            )}
                            {confidence !== undefined && (
                                <div>
                                    <h4 className="font-semibold text-sm mb-1 text-slate-300">Confidence</h4>
                                    <div className="flex items-center gap-2">
                                        <Progress value={confidence} className="w-1/2 bg-slate-700" />
                                        <span className="text-sm text-muted-foreground font-mono">{confidence}%</span>
                                    </div>
                                </div>
                            )}
                            {summary && (
                                <div>
                                    <h4 className="font-semibold text-sm mb-1 text-slate-300">Analysis Summary</h4>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{summary}</p>
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
