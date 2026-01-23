import { Brain, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AiHealthSummaryProps {
  summary: string;
  conditions: string[];
}

export function AiHealthSummary({ summary, conditions }: AiHealthSummaryProps) {
  const paragraphs = summary.split('\n\n');
  
  return (
    <Card className="shadow-medical-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-medical">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">AI-Generated Health Summary</CardTitle>
              <p className="text-sm text-muted-foreground">Comprehensive analysis of all health records</p>
            </div>
          </div>
          <Badge variant="outline" className="border-primary text-primary">
            <TrendingUp className="h-3 w-3 mr-1" />
            Updated Today
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 pb-2">
          {conditions.map((condition, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="bg-status-warning/10 text-status-warning border-status-warning/20"
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              {condition}
            </Badge>
          ))}
        </div>
        
        <div className="space-y-3 text-sm leading-relaxed">
          {paragraphs.map((paragraph, index) => (
            <p 
              key={index} 
              className={paragraph.startsWith('RECOMMENDATIONS') ? 'font-medium text-foreground pt-2' : 'text-muted-foreground'}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
