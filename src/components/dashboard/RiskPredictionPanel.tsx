import { AlertCircle, Heart, Activity, Brain, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { RiskPrediction } from '@/data/mockPatientData';

interface RiskPredictionPanelProps {
  predictions: RiskPrediction;
}

const riskConfig = [
  { key: 'diabetesProgression', label: 'Diabetes Progression', icon: Droplets },
  { key: 'cardiovascular', label: 'Cardiovascular Disease', icon: Heart },
  { key: 'cancer', label: 'Cancer Risk', icon: Activity },
  { key: 'kidney', label: 'Kidney Disease', icon: Brain },
  { key: 'stroke', label: 'Stroke Risk', icon: AlertCircle },
] as const;

function getRiskLevel(value: number): { label: string; className: string; bgClassName: string } {
  if (value < 30) {
    return { 
      label: 'Low', 
      className: 'text-risk-low',
      bgClassName: 'bg-risk-low'
    };
  }
  if (value < 60) {
    return { 
      label: 'Medium', 
      className: 'text-risk-medium',
      bgClassName: 'bg-risk-medium'
    };
  }
  return { 
    label: 'High', 
    className: 'text-risk-high',
    bgClassName: 'bg-risk-high'
  };
}

export function RiskPredictionPanel({ predictions }: RiskPredictionPanelProps) {
  return (
    <Card className="shadow-medical-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-warning/10">
            <AlertCircle className="h-5 w-5 text-status-warning" />
          </div>
          <div>
            <CardTitle className="text-lg">Disease Risk Predictions</CardTitle>
            <p className="text-sm text-muted-foreground">AI-powered risk assessment</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {riskConfig.map(({ key, label, icon: Icon }) => {
            const value = predictions[key];
            const risk = getRiskLevel(value);
            
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={cn('h-4 w-4', risk.className)} />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-sm font-semibold', risk.className)}>
                      {value}%
                    </span>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      value < 30 && 'bg-risk-low/10 text-risk-low',
                      value >= 30 && value < 60 && 'bg-risk-medium/10 text-risk-medium',
                      value >= 60 && 'bg-risk-high/10 text-risk-high'
                    )}>
                      {risk.label}
                    </span>
                  </div>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn('h-full transition-all duration-500', risk.bgClassName)}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-risk-low" />
              <span>Low Risk (0-29%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-risk-medium" />
              <span>Medium (30-59%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-risk-high" />
              <span>High (60%+)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
