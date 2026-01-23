import { User, Mail, Phone, MapPin, CreditCard, Calendar, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Patient } from '@/data/mockPatientData';
import { format, parseISO } from 'date-fns';

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  const initials = `${patient.firstName[0]}${patient.lastName[0]}`;

  return (
    <Card className="shadow-medical-lg overflow-hidden">
      {/* Header with gradient */}
      <div className="h-24 gradient-medical" />
      
      <CardHeader className="relative pt-0 pb-4">
        {/* Avatar positioned over gradient */}
        <div className="absolute -top-12 left-6">
          <Avatar className="h-24 w-24 border-4 border-card shadow-lg">
            <AvatarImage src={patient.avatar} alt={`${patient.firstName} ${patient.lastName}`} />
            <AvatarFallback className="text-2xl font-semibold bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        
        {/* Patient name and ID */}
        <div className="ml-32 pt-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold">
              {patient.firstName} {patient.lastName}
            </h2>
            <Badge variant="outline" className="font-mono">
              {patient.id}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>{patient.age} years old</span>
            <span>{patient.gender}</span>
            <span>DOB: {format(parseISO(patient.dateOfBirth), 'MMMM d, yyyy')}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="grid gap-6 md:grid-cols-2">
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Contact Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm">{patient.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <Phone className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm">{patient.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm">
                  {patient.address.street}<br />
                  {patient.address.city}, {patient.address.state} {patient.address.zip}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Medical & Insurance */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Medical & Insurance
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Primary Physician</p>
                <p className="text-sm">{patient.primaryPhysician}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Insurance</p>
                <p className="text-sm">{patient.insuranceProvider}</p>
                <p className="text-xs text-muted-foreground font-mono">{patient.insuranceId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Visit</p>
                <p className="text-sm">{format(parseISO(patient.lastVisit), 'MMMM d, yyyy')}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Outstanding Balance */}
        {patient.outstandingBalance > 0 && (
          <div className="md:col-span-2 p-4 bg-status-warning/10 rounded-lg border border-status-warning/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Outstanding Balance</p>
                <p className="text-xs text-muted-foreground">Payment due</p>
              </div>
              <p className="text-2xl font-semibold text-status-warning">
                ${patient.outstandingBalance.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
