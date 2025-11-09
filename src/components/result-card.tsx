import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReactNode } from 'react';

interface ResultCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function ResultCard({ title, icon, children }: ResultCardProps) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex items-center gap-4">
          {icon}
          <CardTitle className="font-headline">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
