import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ClinicalTimeline({ notes }: { notes: any[] }) {
    if (!notes || notes.length === 0) return null;

    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="uppercase tracking-wide text-xs font-bold text-muted-foreground bg-gray-50/50 pb-3">
                Clinical Timeline
            </CardHeader>
            <CardContent className="pt-4 space-y-0">
                {notes.map((note: any, i: number) => (
                    <div key={i} className="relative pl-6 pb-6 last:pb-0 border-l border-gray-200 ml-2">
                        <div className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-blue-400 ring-4 ring-white"></div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-500">{note.date}</span>
                            <span className="text-sm font-medium text-gray-900">{note.doctor}</span>
                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-100 mt-1">"{note.summary}"</p>
                            <div className="mt-1">
                                <SentimentBadge sentiment={note.sentiment} />
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

const SentimentBadge = ({ sentiment }: { sentiment: string }) => {
    const color = sentiment === 'Deteriorating' ? 'text-red-600 bg-red-50 border-red-200' :
        sentiment === 'Improving' ? 'text-green-600 bg-green-50 border-green-200' :
            'text-blue-600 bg-blue-50 border-blue-200';
    return (
        <span className={`text-xs px-2 py-0.5 rounded border ${color} inline-block`}>
            {sentiment}
        </span>
    )
}
