
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, Activity, FlaskConical, Dna, FileText } from "lucide-react";
import { api } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AgentStatusProps {
    name: string;
    role: string;
    icon: any;
    status: 'idle' | 'working' | 'done';
    delay: number;
    onClick?: () => void;
    active?: boolean;
}

const AgentIcon = ({ name, role, icon: Icon, status, delay, onClick, active }: AgentStatusProps) => (
    <div
        onClick={onClick}
        className={cn(
            "flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 cursor-pointer border-2",
            active ? "bg-white border-indigo-500 shadow-md transform scale-105" : "border-transparent hover:bg-white/50",
            status === 'working' && "animate-pulse"
        )}
    >
        <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
            status === 'idle' ? "bg-gray-100 text-gray-400" :
                status === 'working' ? "bg-indigo-100 text-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.5)]" :
                    "bg-green-100 text-green-600"
        )}>
            <Icon className="h-5 w-5" />
        </div>
        <div className="text-center">
            <p className="text-xs font-semibold text-gray-700">{name}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">{role}</p>
        </div>
    </div>
);

export function AIInsights({ patientId }: { patientId: number }) {
    const [summary, setSummary] = useState<string | null>(null);
    const [details, setDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // 'idle', 'working', 'done'
    const [agentState, setAgentState] = useState<'idle' | 'working' | 'done'>('idle');
    const [selectedAgent, setSelectedAgent] = useState<string>('summary');

    const fetchStoredAnalysis = async () => {
        try {
            const data = await api.getPatientAISummary(patientId);
            if (data && data.summary) {
                setSummary(data.summary);
                setDetails(data.agent_details);
                setAgentState('done');
            }
        } catch (e) {
            console.log("No saved analysis found.");
        }
    };

    const generateAnalysis = async () => {
        setLoading(true);
        setAgentState('working');
        setSummary(null);

        try {
            const data = await api.generatePatientAISummary(patientId);
            setSummary(data.summary);
            setDetails(data.agent_details);
            setAgentState('done');
        } catch (error) {
            console.error("AI Analysis Error:", error);
            setSummary("Unable to generate analysis. Please ensure the local AI engine is running.");
            setAgentState('idle'); // Reset on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Reset when patient changes
        setSummary(null);
        setDetails(null);
        setAgentState('idle');
        setSelectedAgent('summary');
        fetchStoredAnalysis();
    }, [patientId]);

    return (
        <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 overflow-hidden">
            <CardHeader className="pb-2 border-b border-indigo-50/50">
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-indigo-800 text-lg">
                        <Sparkles className="h-5 w-5 text-indigo-600" />
                        AI Medical Board
                    </CardTitle>
                    {!loading && (
                        <Button
                            size="sm"
                            onClick={generateAnalysis}
                            variant={agentState === 'done' ? "outline" : "default"}
                            className={cn(
                                "gap-2 transition-all shadow-sm",
                                agentState === 'done' ? "bg-white text-indigo-600 hover:bg-indigo-50" : "bg-indigo-600 hover:bg-indigo-700 text-white"
                            )}
                        >
                            <Brain className="h-4 w-4" />
                            {agentState === 'done' ? "Regenerate" : "Start Analysis"}
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-6">

                {/* Agent Board Visualization */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                    <AgentIcon
                        name="Vitals"
                        role="Cardiology"
                        icon={Activity}
                        status={agentState}
                        delay={0}
                        active={selectedAgent === 'vitals'}
                        onClick={() => agentState === 'done' && setSelectedAgent('vitals')}
                    />
                    <AgentIcon
                        name="Labs"
                        role="Pathology"
                        icon={FlaskConical}
                        status={agentState}
                        delay={1}
                        active={selectedAgent === 'labs'}
                        onClick={() => agentState === 'done' && setSelectedAgent('labs')}
                    />
                    <AgentIcon
                        name="Risks"
                        role="Genomics"
                        icon={Dna}
                        status={agentState}
                        delay={2}
                        active={selectedAgent === 'risks'}
                        onClick={() => agentState === 'done' && setSelectedAgent('risks')}
                    />
                    <AgentIcon
                        name="Scribe"
                        role="CMO"
                        icon={FileText}
                        status={agentState}
                        delay={3}
                        active={selectedAgent === 'summary'}
                        onClick={() => agentState === 'done' && setSelectedAgent('summary')}
                    />
                </div>

                {/* Progress State */}
                {loading && (
                    <div className="text-center py-8">
                        <div className="inline-flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full animate-pulse">
                            <Brain className="h-4 w-4 animate-spin" />
                            <span className="text-sm font-medium">Orchestrating Agents...</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Llama 3 is coordinating the medical team
                        </p>
                    </div>
                )}

                {/* Results Display */}
                {!loading && agentState === 'done' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl border border-indigo-100 shadow-sm p-5 min-h-[200px]"
                    >
                        {selectedAgent === 'summary' && summary && (
                            <div className="prose prose-sm max-w-none">
                                <h3 className="text-indigo-900 font-semibold mb-3 flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Executive Summary
                                </h3>
                                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                    {summary}
                                </div>
                            </div>
                        )}

                        {selectedAgent === 'vitals' && details?.vitals && (
                            <div className="prose prose-sm max-w-none">
                                <h3 className="text-indigo-900 font-semibold mb-3 flex items-center gap-2">
                                    <Activity className="h-4 w-4" />
                                    Cardiologist's Report
                                </h3>
                                <div className="whitespace-pre-wrap text-gray-700 bg-red-50/50 p-4 rounded-lg border border-red-100">
                                    {details.vitals}
                                </div>
                            </div>
                        )}

                        {selectedAgent === 'labs' && details?.labs && (
                            <div className="prose prose-sm max-w-none">
                                <h3 className="text-indigo-900 font-semibold mb-3 flex items-center gap-2">
                                    <FlaskConical className="h-4 w-4" />
                                    Pathologist's Report
                                </h3>
                                <div className="whitespace-pre-wrap text-gray-700 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                                    {details.labs}
                                </div>
                            </div>
                        )}

                        {selectedAgent === 'risks' && details?.risks && (
                            <div className="prose prose-sm max-w-none">
                                <h3 className="text-indigo-900 font-semibold mb-3 flex items-center gap-2">
                                    <Dna className="h-4 w-4" />
                                    Geneticist's Risk Assessment
                                </h3>
                                <div className="whitespace-pre-wrap text-gray-700 bg-purple-50/50 p-4 rounded-lg border border-purple-100">
                                    {details.risks}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </CardContent>
        </Card>
    );
}
