
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Info, AlertOctagon, CheckCircle2 } from "lucide-react";

interface Risk {
    condition: string;
    probability: string;
    reason: string;
    severity: string;
}

export const RiskPrediction = ({ risks }: { risks: Risk[] }) => {
    const getSeverityStyle = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'critical': return 'bg-red-50 border-red-200 text-red-900 border-l-red-500';
            case 'high': return 'bg-orange-50 border-orange-200 text-orange-900 border-l-orange-500';
            case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-900 border-l-yellow-500';
            default: return 'bg-blue-50 border-blue-200 text-blue-900 border-l-blue-500';
        }
    };

    const getIcon = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'critical': return <AlertOctagon className="h-5 w-5 text-red-600" />;
            case 'high': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
            default: return <Info className="h-5 w-5 text-blue-600" />;
        }
    };

    return (
        <Card className="shadow-md border-0 ring-1 ring-gray-200">
            <CardHeader className="pb-3 border-b flex flex-row justify-between items-center">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <ActivityIcon />
                    Risk Analysis
                </CardTitle>
                <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded">AI Model v2.1</span>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                {risks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
                        <h4 className="font-semibold text-gray-900">No Major Risks Detected</h4>
                        <p className="text-sm text-gray-500">Patient appears to be in good health based on available data.</p>
                    </div>
                ) : (
                    risks.map((risk, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-r-lg border border-l-4 flex items-start gap-4 transition-transform hover:scale-[1.02] ${getSeverityStyle(risk.severity)}`}
                        >
                            <div className="mt-0.5 shrink-0 bg-white p-1.5 rounded-full shadow-sm">
                                {getIcon(risk.severity)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-base">{risk.condition}</h4>
                                    <span className="text-[10px] bg-white/60 px-2 py-0.5 rounded-full border border-black/5 font-bold uppercase tracking-wider">
                                        {risk.probability} Prob.
                                    </span>
                                </div>
                                <p className="text-sm mt-1 opacity-90 leading-relaxed font-medium">{risk.reason}</p>
                                <div className="mt-2 w-full bg-black/5 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${risk.severity === 'Critical' ? 'bg-red-500 w-[95%]' :
                                                risk.severity === 'High' ? 'bg-orange-500 w-[75%]' : 'bg-yellow-500 w-[50%]'
                                            }`}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
};

const ActivityIcon = () => (
    <div className="p-1.5 bg-indigo-100 rounded-md text-indigo-600">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
    </div>
);
