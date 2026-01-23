import { Dna, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GenomicRisk } from '@/data/mockPatientData';
import { cn } from '@/lib/utils';

interface GenomicsInsightsProps {
  genomicRisks: GenomicRisk[];
}

function getRiskBadgeClass(score: number): string {
  if (score < 0.3) return 'bg-risk-low/10 text-risk-low border-risk-low/20';
  if (score < 0.6) return 'bg-risk-medium/10 text-risk-medium border-risk-medium/20';
  return 'bg-risk-high/10 text-risk-high border-risk-high/20';
}

export function GenomicsInsights({ genomicRisks }: GenomicsInsightsProps) {
  return (
    <Card className="shadow-medical-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-tertiary/10">
            <Dna className="h-5 w-5 text-chart-tertiary" />
          </div>
          <div>
            <CardTitle className="text-lg">Genomics Risk Insights</CardTitle>
            <p className="text-sm text-muted-foreground">Genetic variants and disease associations</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Gene</TableHead>
                <TableHead className="font-semibold">Mutation ID</TableHead>
                <TableHead className="font-semibold">Associated Disease</TableHead>
                <TableHead className="font-semibold text-center">Risk Score</TableHead>
                <TableHead className="font-semibold hidden lg:table-cell">Interpretation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {genomicRisks.map((risk, index) => (
                <TableRow key={index} className="hover:bg-muted/30">
                  <TableCell className="font-mono font-semibold text-primary">
                    {risk.gene}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    <a 
                      href={`https://www.ncbi.nlm.nih.gov/snp/${risk.mutationId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      {risk.mutationId}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell>{risk.associatedDisease}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={getRiskBadgeClass(risk.riskScore)}>
                      {Math.round(risk.riskScore * 100)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden lg:table-cell max-w-[250px]">
                    {risk.interpretation}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Mobile interpretation cards */}
        <div className="lg:hidden mt-4 space-y-3">
          {genomicRisks.map((risk, index) => (
            <div key={index} className="p-3 rounded-lg bg-muted/30 text-sm">
              <span className="font-semibold text-primary">{risk.gene}</span>
              <span className="text-muted-foreground"> - {risk.interpretation}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
