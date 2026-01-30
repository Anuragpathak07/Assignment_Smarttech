import { Brain, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';

interface AiHealthSummaryProps {
  summary: string;
  conditions: string[];
}

export function AiHealthSummary({ summary, conditions }: AiHealthSummaryProps) {

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

        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground ai-summary-content">
          <ReactMarkdown
            components={{
              p: ({ ...props }) => <p className="mb-3 last:mb-0" {...props} />,
              strong: ({ ...props }) => <span className="font-semibold text-foreground" {...props} />,
              ul: ({ ...props }) => <ul className="list-disc pl-5 space-y-1 my-2" {...props} />,
              ol: ({ ...props }) => <ol className="list-decimal pl-5 space-y-1 my-2" {...props} />,
              li: ({ ...props }) => <li className="" {...props} />,
              h1: ({ ...props }) => <h3 className="font-semibold text-foreground text-lg mt-4 mb-2 first:mt-0" {...props} />,
              h2: ({ ...props }) => <h3 className="font-semibold text-foreground text-base mt-4 mb-2" {...props} />,
              h3: ({ ...props }) => <h3 className="font-medium text-foreground text-sm mt-3 mb-1" {...props} />,
            }}
          >
            {summary}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
