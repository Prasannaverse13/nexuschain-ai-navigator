"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { forecastDemand, type ForecastDemandOutput } from '@/ai/flows/demand-forecasting';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, TrendingUp } from 'lucide-react';
import { ResultCard } from './result-card';
import { AgentActivityLog } from './agent-activity-log';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const formSchema = z.object({
  productName: z.string().min(2, { message: 'Product name must be at least 2 characters.' }),
  timePeriod: z.string().min(2, { message: 'Time period must be at least 2 characters.' }),
});

export function DemandForecastingTab() {
  const [result, setResult] = useState<ForecastDemandOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('');

  useEffect(() => {
    const color = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    if (color) {
      setPrimaryColor(`hsl(${color})`);
    }
  }, []);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: 'Product X',
      timePeriod: 'Q3 2025',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const forecast = await forecastDemand(values);
      setResult(forecast);
    } catch (error) {
      console.error('Error forecasting demand:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const chartData = result ? [
    { name: 'Historical', Demand: Math.round(result.forecastedDemand * 0.85) }, // Mock historical data
    { name: 'Forecasted', Demand: result.forecastedDemand },
  ] : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Demand Forecasting Agent</CardTitle>
        <CardDescription>Predict future product demand using historical sales data and external factors.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Steel Beams" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Period</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Q3 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Forecast Demand
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
            <ResultCard title="Forecast Result" icon={<TrendingUp className="h-8 w-8 text-primary" />}>
              <p className="text-4xl font-bold text-primary">{result.forecastedDemand.toLocaleString()} units</p>
              <p className="text-muted-foreground mt-2">{result.rationale}</p>
            </ResultCard>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Demand Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Demand" fill={primaryColor || '#4285F4'} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <AgentActivityLog
              log={[
                { timestamp: new Date(Date.now() - 1500), agent: 'Demand Forecasting Agent', action: `Initiated forecast for ${form.getValues('productName')} for ${form.getValues('timePeriod')}.` },
                { timestamp: new Date(Date.now() - 1000), agent: 'Data Analysis Agent (simulated)', action: 'Analyzed historical sales data from BigQuery.' },
                { timestamp: new Date(Date.now() - 500), agent: 'External Factors Agent (simulated)', action: 'Incorporated market trend indicators.' },
                { timestamp: new Date(), agent: 'Demand Forecasting Agent', action: 'Finalized forecast based on integrated data.' },
              ]}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
