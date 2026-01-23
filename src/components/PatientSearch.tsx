
import { useState, useEffect } from "react";
import { Search, User } from "lucide-react";
import { api } from "@/services/api";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";

interface Patient {
    id: number;
    name: string;
    age: number;
    gender: string;
}

interface PatientSearchProps {
    onSelect: (patientId: number) => void;
    currentPatientName?: string;
}

export function PatientSearch({ onSelect, currentPatientName }: PatientSearchProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Patient[]>([]);

    useEffect(() => {
        const search = async () => {
            if (query.length > 1) {
                const data = await api.searchPatients(query);
                setResults(data);
            } else {
                setResults([]);
            }
        };

        const debounce = setTimeout(search, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[250px] justify-between text-muted-foreground"
                >
                    {currentPatientName ? (
                        <span className="text-foreground font-medium flex items-center gap-2">
                            <User className="h-4 w-4" /> {currentPatientName}
                        </span>
                    ) : (
                        "Search for a patient..."
                    )}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Type a name..."
                        value={query}
                        onValueChange={setQuery}
                    />
                    <CommandList>
                        <CommandEmpty>No patients found.</CommandEmpty>
                        <CommandGroup heading="Suggestions">
                            {results.map((patient) => (
                                <CommandItem
                                    key={patient.id}
                                    value={patient.name}
                                    onSelect={() => {
                                        onSelect(patient.id);
                                        setOpen(false);
                                        setQuery("");
                                    }}
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    <div className="flex flex-col">
                                        <span className="font-medium">{patient.name}</span>
                                        <span className="text-xs text-muted-foreground">ID: {patient.id} • {patient.age}y • {patient.gender}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
