import { Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Diagnosis } from '@/data/mockPatientData';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface DiagnosesListProps {
  diagnoses: Diagnosis[];
}

function getStatusBadgeClass(status: Diagnosis['status']): string {
  switch (status) {
    case 'Active':
      return 'bg-status-warning/10 text-status-warning border-status-warning/20';
    case 'Resolved':
      return 'bg-status-normal/10 text-status-normal border-status-normal/20';
    case 'Monitoring':
      return 'bg-status-info/10 text-status-info border-status-info/20';
  }
}

function getSeverityBadgeClass(severity: Diagnosis['severity']): string {
  switch (severity) {
    case 'Low':
      return 'bg-risk-low/10 text-risk-low';
    case 'Medium':
      return 'bg-risk-medium/10 text-risk-medium';
    case 'High':
      return 'bg-risk-high/10 text-risk-high';
  }
}

export function DiagnosesList({ diagnoses }: DiagnosesListProps) {
  return (
    <Card className="shadow-medical-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-warning/10">
            <Activity className="h-5 w-5 text-status-warning" />
          </div>
          <div>
            <CardTitle className="text-lg">Active Diagnoses</CardTitle>
            <p className="text-sm text-muted-foreground">Current medical conditions</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {diagnoses.map((diagnosis, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    {diagnosis.code}
                  </span>
                  <Badge className={cn('text-xs', getSeverityBadgeClass(diagnosis.severity))}>
                    {diagnosis.severity}
                  </Badge>
                </div>
                <p className="font-medium mt-1">{diagnosis.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Diagnosed: {format(parseISO(diagnosis.diagnosedDate), 'MMM d, yyyy')}
                </p>
              </div>
              <Badge className={getStatusBadgeClass(diagnosis.status)}>
                {diagnosis.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
