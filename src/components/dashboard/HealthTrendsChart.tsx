import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Legend,
} from 'recharts';
import { LabResult } from '@/data/mockPatientData';
import { format, parseISO, subMonths, isAfter } from 'date-fns';

interface HealthTrendsChartProps {
  labHistory: LabResult[];
}

type TimeRange = '6m' | '1y' | 'all';

const hba1cThresholds = {
  normal: { min: 0, max: 5.7, color: 'hsl(142, 70%, 45%)' },
  preDiabetic: { min: 5.7, max: 6.5, color: 'hsl(38, 92%, 50%)' },
  diabetic: { min: 6.5, max: 14, color: 'hsl(0, 72%, 51%)' },
};

const bpThresholds = {
  normal: { systolic: 120, diastolic: 80, color: 'hsl(142, 70%, 45%)' },
  elevated: { systolic: 130, diastolic: 80, color: 'hsl(38, 92%, 50%)' },
  high: { systolic: 140, diastolic: 90, color: 'hsl(0, 72%, 51%)' },
};

export function HealthTrendsChart({ labHistory }: HealthTrendsChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  const filterDataByTimeRange = (data: LabResult[]) => {
    if (timeRange === 'all') return data;
    
    const cutoffDate = timeRange === '6m' 
      ? subMonths(new Date(), 6)
      : subMonths(new Date(), 12);
    
    return data.filter(item => isAfter(parseISO(item.date), cutoffDate));
  };

  const filteredData = filterDataByTimeRange(labHistory).map(item => ({
    ...item,
    formattedDate: format(parseISO(item.date), 'MMM yyyy'),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg shadow-lg p-3 text-sm">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="flex justify-between gap-4">
              <span>{entry.name}:</span>
              <span className="font-medium">{entry.value} {entry.unit || ''}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-medical-lg">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-primary/10">
              <TrendingUp className="h-5 w-5 text-chart-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Critical Health Trends</CardTitle>
              <p className="text-sm text-muted-foreground">Time-series analysis of key indicators</p>
            </div>
          </div>
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last 1 Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="hba1c" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hba1c">HbA1C</TabsTrigger>
            <TabsTrigger value="bp">Blood Pressure</TabsTrigger>
            <TabsTrigger value="cholesterol">Cholesterol</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hba1c" className="space-y-4">
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: hba1cThresholds.normal.color }} />
                <span>Normal (&lt;5.7%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: hba1cThresholds.preDiabetic.color }} />
                <span>Pre-Diabetic (5.7-6.5%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: hba1cThresholds.diabetic.color }} />
                <span>Diabetic (&gt;6.5%)</span>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="formattedDate" 
                    tick={{ fontSize: 12 }} 
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    domain={[4, 10]} 
                    tick={{ fontSize: 12 }} 
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceArea y1={0} y2={5.7} fill={hba1cThresholds.normal.color} fillOpacity={0.1} />
                  <ReferenceArea y1={5.7} y2={6.5} fill={hba1cThresholds.preDiabetic.color} fillOpacity={0.1} />
                  <ReferenceArea y1={6.5} y2={14} fill={hba1cThresholds.diabetic.color} fillOpacity={0.1} />
                  <ReferenceLine y={6.5} stroke={hba1cThresholds.diabetic.color} strokeDasharray="5 5" />
                  <Line 
                    type="monotone" 
                    dataKey="hba1c" 
                    name="HbA1C"
                    stroke="hsl(var(--chart-primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="bp" className="space-y-4">
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-chart-primary" />
                <span>Systolic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-chart-secondary" />
                <span>Diastolic</span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="w-6 h-0.5 bg-status-warning" style={{ borderStyle: 'dashed' }} />
                <span>High BP Threshold</span>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="formattedDate" 
                    tick={{ fontSize: 12 }} 
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    domain={[60, 180]} 
                    tick={{ fontSize: 12 }} 
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(v) => `${v}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <ReferenceLine y={140} stroke="hsl(var(--status-warning))" strokeDasharray="5 5" label="" />
                  <ReferenceLine y={90} stroke="hsl(var(--status-warning))" strokeDasharray="5 5" label="" />
                  <Line 
                    type="monotone" 
                    dataKey="systolic" 
                    name="Systolic"
                    stroke="hsl(var(--chart-primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-primary))', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="diastolic" 
                    name="Diastolic"
                    stroke="hsl(var(--chart-secondary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-secondary))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="cholesterol" className="space-y-4">
            <div className="flex gap-4 text-xs flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-status-critical" />
                <span>LDL (Bad)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-status-normal" />
                <span>HDL (Good)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-chart-secondary" />
                <span>Total</span>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="formattedDate" 
                    tick={{ fontSize: 12 }} 
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    domain={[0, 300]} 
                    tick={{ fontSize: 12 }} 
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(v) => `${v}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <ReferenceLine y={100} stroke="hsl(var(--status-warning))" strokeDasharray="5 5" label="" />
                  <Line 
                    type="monotone" 
                    dataKey="ldl" 
                    name="LDL"
                    stroke="hsl(var(--status-critical))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--status-critical))', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hdl" 
                    name="HDL"
                    stroke="hsl(var(--status-normal))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--status-normal))', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalCholesterol" 
                    name="Total"
                    stroke="hsl(var(--chart-secondary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-secondary))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
