import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

export const MobileLayout = ({ children, className }: MobileLayoutProps) => {
  return (
    <div className={cn(
      "min-h-screen bg-background flex flex-col",
      "max-w-md mx-auto relative",
      className
    )}>
      {children}
    </div>
  );
};

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export const MobileHeader = ({ title, subtitle, action }: MobileHeaderProps) => {
  return (
    <header className="bg-gradient-primary text-primary-foreground px-4 pt-12 pb-6 shadow-app-md">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-primary-foreground/80 text-sm mt-1">{subtitle}</p>
          )}
        </div>
        {action && <div className="ml-4">{action}</div>}
      </div>
    </header>
  );
};

interface MobileContentProps {
  children: ReactNode;
  className?: string;
}

export const MobileContent = ({ children, className }: MobileContentProps) => {
  return (
    <main className={cn(
      "flex-1 bg-surface min-h-0",
      className
    )}>
      {children}
    </main>
  );
};