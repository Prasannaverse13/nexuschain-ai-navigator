"use client";

import { useRef } from 'react';
import type { MainQueryOutput } from '@/ai/flows/main-query.schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportDisplayProps {
  report: MainQueryOutput['report'];
}

export function ReportDisplay({ report }: ReportDisplayProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    const input = reportRef.current;
    if (!input) return;

    // Use html2canvas to render the component to a canvas
    const canvas = await html2canvas(input, {
        scale: 2, // Higher scale for better resolution
        backgroundColor: '#020817' // Match the dark background
    });

    const imgData = canvas.toDataURL('image/png');

    // Create a new PDF document
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('NexusChain-AI-Report.pdf');
  };

  return (
    <Card className="bg-secondary/20 backdrop-blur-xl border border-border/30 shadow-2xl rounded-2xl">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-2xl font-headline text-slate-100">Manager Agent Report</CardTitle>
          <CardDescription className="text-slate-400 mt-1">
            A comprehensive analysis synthesized from all agent findings.
          </CardDescription>
        </div>
        <Button onClick={handleDownloadPdf} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </CardHeader>
      <CardContent>
        <div ref={reportRef} className="p-6 rounded-lg bg-background/50">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold font-headline text-primary">{report.reportTitle}</h1>
            <p className="text-sm text-muted-foreground mt-1">Generated on: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold font-headline mb-2 text-slate-200 border-b border-slate-700 pb-2">Executive Summary</h2>
              <p className="text-base text-slate-300 whitespace-pre-wrap">{report.executiveSummary}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold font-headline mb-3 text-slate-200 border-b border-slate-700 pb-2">Key Challenges & Insights</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[15%] text-slate-300">Domain</TableHead>
                    <TableHead className="w-[45%] text-slate-300">Challenges Identified</TableHead>
                    <TableHead className="w-[40%] text-slate-300">Recommendations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.keyChallengesAndInsights.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-primary">{item.domain}</TableCell>
                      <TableCell className="text-slate-300">{item.challengesIdentified}</TableCell>
                      <TableCell className="text-slate-300">{item.recommendations}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold font-headline mb-3 text-slate-200 border-b border-slate-700 pb-2">Suggested Actions</h2>
              <ul className="list-disc list-inside space-y-2 text-base text-slate-300">
                {report.suggestedActions.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
