"use client";

import { PageHeader } from '@/components/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DemandForecastingTab } from '@/components/demand-forecasting-tab';
import { AnomalyDetectionTab } from '@/components/anomaly-detection-tab';
import { ProcurementSuggestionTab } from '@/components/procurement-suggestion-tab';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <PageHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-headline font-semibold">Supply Chain Optimization</h1>
          <p className="text-muted-foreground">
            Use AI agents to optimize your supply chain. Select a tool below to get started.
          </p>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start">
          <Tabs defaultValue="demand-forecasting" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
              <TabsTrigger value="demand-forecasting">Demand Forecasting</TabsTrigger>
              <TabsTrigger value="anomaly-detection">Anomaly Detection</TabsTrigger>
              <TabsTrigger value="procurement-suggestion">Procurement Suggestion</TabsTrigger>
            </TabsList>
            <TabsContent value="demand-forecasting">
              <DemandForecastingTab />
            </TabsContent>
            <TabsContent value="anomaly-detection">
              <AnomalyDetectionTab />
            </TabsContent>
            <TabsContent value="procurement-suggestion">
              <ProcurementSuggestionTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
