
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, ComposedChart } from "recharts";

interface ChartProps {
    title: string;
    subtitle?: string;
    data: any[];
    dataKeys: { key: string; color: string; name: string }[];
    yLabel?: string;
    height?: number;
}

export const TrendChart = ({ title, subtitle, data, dataKeys, yLabel, height = 350 }: ChartProps) => {
    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    return (
        <Card className="shadow-md border-0 ring-1 ring-gray-200">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-gray-800">{title}</CardTitle>
                {subtitle && <CardDescription>{subtitle}</CardDescription>}
            </CardHeader>
            <CardContent className="pt-2">
                <div style={{ width: '100%', height: height }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                {dataKeys.map((k) => (
                                    <linearGradient key={`grad-${k.key}`} id={`grad-${k.key}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={k.color} stopOpacity={0.2} />
                                        <stop offset="95%" stopColor={k.color} stopOpacity={0} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDate}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                dy={10}
                                minTickGap={30}
                            />
                            <YAxis
                                label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                    padding: '12px'
                                }}
                                labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}
                                cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Legend verticalAlign="top" height={36} iconType="circle" />
                            {dataKeys.map((k) => (
                                <Area
                                    key={`area-${k.key}`}
                                    type="monotone"
                                    dataKey={k.key}
                                    stroke="none"
                                    fill={`url(#grad-${k.key})`}
                                />
                            ))}
                            {dataKeys.map((k) => (
                                <Line
                                    key={k.key}
                                    type="monotone"
                                    dataKey={k.key}
                                    stroke={k.color}
                                    name={k.name}
                                    strokeWidth={3}
                                    dot={{ r: 3, strokeWidth: 0, fill: k.color }}
                                    activeDot={{ r: 7, strokeWidth: 4, stroke: 'white' }}
                                />
                            ))}
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
