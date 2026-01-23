
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Phone, MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PatientInfo {
    name: string;
    age: number;
    gender: string;
    contact_info: string;
    address: string;
}

export const HealthSummaryCard = ({ patient }: { patient: PatientInfo }) => {
    return (
        <Card className="shadow-md border-0 ring-1 ring-gray-200 overflow-hidden group">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-100 to-white border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
                    <span className="text-xl font-bold">{patient.name.charAt(0)}</span>
                </div>
                <div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {patient.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold text-gray-700">ID: #{Math.floor(Math.random() * 10000)}</span>
                        <span>•</span>
                        <span>{patient.age} Yrs</span>
                        <span>•</span>
                        <span>{patient.gender}</span>
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-md group-hover:bg-blue-50/50 transition-colors">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <span>{patient.contact_info}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-md group-hover:bg-blue-50/50 transition-colors">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="line-clamp-1">{patient.address}</span>
                </div>

                <Button variant="ghost" className="w-full justify-between mt-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    View Full Profile <ArrowRight className="h-4 w-4" />
                </Button>
            </CardContent>
        </Card>
    );
};
