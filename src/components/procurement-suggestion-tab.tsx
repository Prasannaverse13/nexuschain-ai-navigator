"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { procurementSuggestion, type ProcurementSuggestionOutput } from '@/ai/flows/procurement-suggestion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ShoppingCart } from 'lucide-react';
import { ResultCard } from './result-card';
import { AgentActivityLog } from './agent-activity-log';

const formSchema = z.object({
  demandForecast: z.string().min(10, {message: "Please provide more detail."}),
  currentInventory: z.string().min(10, {message: "Please provide more detail."}),
  inventoryThreshold: z.string().min(10, {message: "Please provide more detail."}),
  anomalyInformation: z.string().optional(),
});

export function ProcurementSuggestionTab() {
  const [result, setResult] = useState<ProcurementSuggestionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      demandForecast: '150,000 units of Product X. Requires 100,000 units of steel and 50,000 units of plastic.',
      currentInventory: 'Steel: 20,000 units. Plastic: 15,000 units.',
      inventoryThreshold: 'Steel: 25,000 units. Plastic: 10,000 units.',
      anomalyInformation: 'Copper price increased by 8%. No other known anomalies.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const suggestion = await procurementSuggestion(values);
      setResult(suggestion);
    } catch (error) {
      console.error('Error getting procurement suggestion:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Procurement Suggestion Agent</CardTitle>
        <CardDescription>Get optimal raw material order suggestions based on forecasts, inventory, and anomalies.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="demandForecast" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Demand Forecast</FormLabel>
                        <FormControl><Textarea rows={4} placeholder="Demand forecast..." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="currentInventory" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Current Inventory</FormLabel>
                        <FormControl><Textarea rows={4} placeholder="Current inventory levels..." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="inventoryThreshold" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Inventory Threshold</FormLabel>
                        <FormControl><Textarea rows={4} placeholder="Inventory thresholds..." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="anomalyInformation" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Anomaly Information (Optional)</FormLabel>
                        <FormControl><Textarea rows={4} placeholder="Known anomalies..." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Suggestions
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
            <ResultCard title="Procurement Suggestion" icon={<ShoppingCart className="h-8 w-8 text-primary" />}>
              <div className="space-y-4">
                <div>
                    <h3 className="font-semibold font-headline">Suggested Orders</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{result.suggestedOrders}</p>
                </div>
                <div className="pt-2">
                    <h3 className="font-semibold font-headline">Reasoning</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{result.reasoning}</p>
                </div>
                {result.riskAssessment && (
                    <div className="pt-2">
                        <h3 className="font-semibold font-headline">Risk Assessment</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{result.riskAssessment}</p>
                    </div>
                )}
              </div>
            </ResultCard>
            <AgentActivityLog
              log={[
                { timestamp: new Date(Date.now() - 2000), agent: 'Procurement Agent', action: `Analyzing inputs to generate suggestions.` },
                { timestamp: new Date(Date.now() - 1500), agent: 'Demand Forecast Agent', action: 'Providing latest demand data.' },
                { timestamp: new Date(Date.now() - 1000), agent: 'Inventory Agent (simulated)', action: 'Providing current stock levels.' },
                { timestamp: new Date(Date.now() - 500), agent: 'Anomaly Detection Agent', action: 'Providing market anomaly data.' },
                { timestamp: new Date(), agent: 'Procurement Agent', action: 'Finalized procurement suggestions.' },
              ]}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
