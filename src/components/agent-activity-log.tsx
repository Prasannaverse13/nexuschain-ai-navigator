"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface LogEntry {
  timestamp: Date;
  agent: string;
  action: string;
}

interface AgentActivityLogProps {
  log: LogEntry[];
}

export function AgentActivityLog({ log }: AgentActivityLogProps) {
  return (
    <Card>
        <CardHeader>
            <CardTitle className="text-lg font-headline">Agent Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            <span>Show agent collaboration details</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ul className="space-y-4 pt-2">
                        {log.map((entry, index) => (
                            <li key={index} className="flex items-start gap-4 relative pl-5">
                                <div className="absolute left-0 top-[9px] h-2 w-2 rounded-full bg-primary" />
                                <div className="w-full">
                                    <p className="font-semibold text-sm">
                                    {entry.agent}
                                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                                        {entry.timestamp.toLocaleTimeString()}
                                    </span>
                                    </p>
                                    <p className="text-sm text-muted-foreground">{entry.action}</p>
                                </div>
                            </li>
                        ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </CardContent>
    </Card>
  );
}
