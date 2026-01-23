import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Scan, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { ImagingFinding } from '@/data/mockPatientData';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

interface ImagingViewerProps {
  findings: ImagingFinding[];
}

export function ImagingViewer({ findings }: ImagingViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentFinding = findings[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? findings.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === findings.length - 1 ? 0 : prev + 1));
  };

  const getSeverityConfig = (severity: ImagingFinding['severity']) => {
    switch (severity) {
      case 'Normal':
        return { 
          className: 'bg-status-normal/10 text-status-normal border-status-normal/20', 
          icon: CheckCircle 
        };
      case 'Abnormal':
        return { 
          className: 'bg-status-warning/10 text-status-warning border-status-warning/20', 
          icon: AlertTriangle 
        };
      case 'Critical':
        return { 
          className: 'bg-status-critical/10 text-status-critical border-status-critical/20', 
          icon: AlertTriangle 
        };
    }
  };

  const severityConfig = getSeverityConfig(currentFinding.severity);

  return (
    <Card className="shadow-medical-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-secondary/10">
              <Scan className="h-5 w-5 text-chart-secondary" />
            </div>
            <div>
              <CardTitle className="text-lg">Imaging Analysis</CardTitle>
              <p className="text-sm text-muted-foreground">AI-detected findings in medical images</p>
            </div>
          </div>
          <Badge variant="outline">
            {currentIndex + 1} of {findings.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image Viewer */}
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            {/* Simulated medical image with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
              {/* Scan lines effect */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full h-px bg-white/30"
                    style={{ top: `${(i + 1) * 5}%` }}
                  />
                ))}
              </div>
              
              {/* AI Detection overlay */}
              {currentFinding.regions?.map((region, idx) => (
                <div
                  key={idx}
                  className="absolute border-2 border-status-critical rounded animate-pulse-slow"
                  style={{
                    left: `${region.x}%`,
                    top: `${region.y}%`,
                    width: `${region.width}%`,
                    height: `${region.height}%`,
                  }}
                >
                  <div className="absolute -top-6 left-0 bg-status-critical text-status-critical-foreground text-xs px-2 py-0.5 rounded whitespace-nowrap">
                    {region.label}
                  </div>
                </div>
              ))}
              
              {/* Type label */}
              <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {currentFinding.type} - {currentFinding.bodyPart}
              </div>
            </div>
            
            {/* Navigation arrows */}
            {findings.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
          
          {/* Finding Details */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{currentFinding.type}</h4>
                <p className="text-sm text-muted-foreground">{currentFinding.bodyPart}</p>
              </div>
              <Badge className={severityConfig.className}>
                <severityConfig.icon className="h-3 w-3 mr-1" />
                {currentFinding.severity}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Finding</p>
                <p className="text-sm mt-1">{currentFinding.finding}</p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">AI Confidence</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all duration-500',
                        currentFinding.probability >= 0.7 ? 'bg-status-critical' : 
                        currentFinding.probability >= 0.4 ? 'bg-status-warning' : 'bg-status-normal'
                      )}
                      style={{ width: `${currentFinding.probability * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">
                    {Math.round(currentFinding.probability * 100)}%
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Scan Date</p>
                <p className="text-sm mt-1">{format(parseISO(currentFinding.date), 'MMMM d, yyyy')}</p>
              </div>
            </div>
            
            {/* Thumbnail navigation */}
            {findings.length > 1 && (
              <div className="pt-4 border-t">
                <p className="text-xs font-medium text-muted-foreground mb-2">All Scans</p>
                <div className="flex gap-2">
                  {findings.map((finding, idx) => (
                    <button
                      key={finding.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={cn(
                        'w-12 h-12 rounded bg-muted flex items-center justify-center text-xs font-medium transition-all',
                        idx === currentIndex 
                          ? 'ring-2 ring-primary ring-offset-2' 
                          : 'opacity-60 hover:opacity-100'
                      )}
                    >
                      {finding.type.split('-')[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
