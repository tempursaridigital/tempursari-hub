import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "featured";
}

export const ServiceCard = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick,
  className,
  variant = "default"
}: ServiceCardProps) => {
  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer transition-all duration-200",
        "hover:shadow-app-md hover:scale-[1.02] active:scale-[0.98]",
        "animate-fade-in",
        variant === "featured" && "bg-gradient-primary text-primary-foreground",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-lg flex-shrink-0",
          variant === "featured" 
            ? "bg-primary-foreground/20 text-primary-foreground" 
            : "bg-primary/10 text-primary"
        )}>
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold mb-1 truncate",
            variant === "featured" ? "text-primary-foreground" : "text-foreground"
          )}>
            {title}
          </h3>
          
          <p className={cn(
            "text-sm leading-relaxed line-clamp-2",
            variant === "featured" 
              ? "text-primary-foreground/80" 
              : "text-muted-foreground"
          )}>
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
};