import { Activity } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-card py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-medical">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">
              MediScope <span className="text-primary">AI</span>
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Unified Intelligence for Your Health Data. For demonstration purposes only.
          </p>
          
          <p className="text-sm text-muted-foreground">
            2024 MediScope AI
          </p>
        </div>
      </div>
    </footer>
  );
}
