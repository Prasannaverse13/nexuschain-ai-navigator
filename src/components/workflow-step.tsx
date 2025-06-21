"use client";

import { BarChartBig, AlertTriangle, ShoppingCart, Truck, Loader2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';

interface WorkflowStepProps {
  icon: string;
  agent: string;
  action: string;
  details: string;
  isLast?: boolean;
}

const iconMap: { [key: string]: React.ElementType } = {
  BarChartBig,
  AlertTriangle,
  ShoppingCart,
  Truck,
  Default: Loader2,
};

export function WorkflowStep({ icon, agent, action, details, isLast = false }: WorkflowStepProps) {
  const IconComponent = iconMap[icon] || iconMap.Default;

  return (
    <div className="relative pl-12 pb-8">
      {!isLast && (
        <div className="absolute left-[22px] top-5 h-full w-0.5 bg-border" aria-hidden="true" />
      )}
      <div className="relative flex items-start space-x-4">
        <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center ring-8 ring-background">
          <IconComponent className="h-6 w-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1 pt-1.5">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
                <Card className="w-full shadow-sm">
                    <AccordionTrigger className="p-4 hover:no-underline text-left [&[data-state=open]>div>svg]:rotate-180">
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-primary">{agent}</p>
                            <p className="mt-1 text-base font-medium text-foreground text-left">{action}</p>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <div className="p-4 bg-secondary/50 rounded-md border">
                            <h4 className="font-semibold text-sm mb-2">Details</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{details}</p>
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
