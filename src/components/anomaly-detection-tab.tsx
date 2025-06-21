"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { detectAnomaly, type DetectAnomalyOutput } from '@/ai/flows/anomaly-detection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ResultCard } from './result-card';
import { AgentActivityLog } from './agent-activity-log';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  dataStreamDescription: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  recentDataSample: z.string().min(10, { message: 'Data sample must be at least 10 characters.' }),
});

export function AnomalyDetectionTab() {
  const [result, setResult] = useState<DetectAnomalyOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accentColor, setAccentColor] = useState('');

  useEffect(() => {
    const color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    if (color) {
      setAccentColor(`hsl(${color})`);
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataStreamDescription: 'Monitoring raw material prices for copper.',
      recentDataSample: 'Price for copper: $4.50/lb (prev: $4.15/lb). Supplier XYZ reports a 2-day shipping delay.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const anomaly = await detectAnomaly(values);
      setResult(anomaly);
    } catch (error) {
      console.error('Error detecting anomaly:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const resultIcon = result?.isAnomaly ? (
    <AlertTriangle className="h-8 w-8 text-destructive" />
  ) : (
    accentColor ? <ShieldCheck className="h-8 w-8" style={{color: accentColor}} /> : <ShieldCheck className="h-8 w-8 text-green-500" />
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Anomaly Detection Agent</CardTitle>
        <CardDescription>Monitor data streams and get alerted to unusual events like price spikes or delays.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="dataStreamDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Stream Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Monitoring real-time shipment locations for Batch #123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recentDataSample"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recent Data Sample</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Shipment #123 is stationary for 3 hours. Weather service reports unexpected road closures." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analyze Data
            </Button>
          </form>
        </Form>
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-muted-foreground">Agents are collaborating...</p>
          </div>
        )}
        {result && (
          <div className="space-y-6 pt-4">
            <ResultCard title="Analysis Result" icon={resultIcon}>
                <div className="flex items-center gap-2 mb-2">
                    {result.isAnomaly ? (
                    <Badge variant="destructive">Anomaly Detected</Badge>
                    ) : (
                    <Badge className="bg-accent text-accent-foreground hover:bg-accent/90">No Anomaly Detected</Badge>
                    )}
                </div>
              <p className="text-lg">{result.anomalyDescription}</p>
              <div className="mt-4 p-4 bg-secondary rounded-lg">
                <h4 className="font-semibold">Suggested Action</h4>
                <p className="text-muted-foreground mt-1">{result.suggestedActions}</p>
              </div>
            </ResultCard>
            <AgentActivityLog
              log={[
                { timestamp: new Date(), agent: 'Anomaly Detection Agent', action: `Started monitoring data stream.` },
                { timestamp: new Date(Date.now() - 500), agent: 'Data Ingestion Agent (simulated)', action: `Received new sample: "${form.getValues('recentDataSample').substring(0, 30)}...".` },
                { timestamp: new Date(Date.now() - 1000), agent: 'Anomaly Detection Agent', action: `Analysis complete. ${result.isAnomaly ? 'Anomaly found.' : 'No anomalies detected.'}` },
                ...(result.isAnomaly ? [{ timestamp: new Date(Date.now() - 1200), agent: 'Notification Agent (simulated)', action: `Alerting relevant stakeholders.` }] : []),
              ]}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
