import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsCardProps {
  title: string;
  excerpt: string;
  image?: string;
  date: string;
  author?: string;
  category?: string;
  onClick?: () => void;
  className?: string;
}

export const NewsCard = ({ 
  title, 
  excerpt, 
  image, 
  date, 
  author, 
  category,
  onClick,
  className 
}: NewsCardProps) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden cursor-pointer transition-all duration-200",
        "hover:shadow-app-md hover:scale-[1.02] active:scale-[0.98]",
        "animate-fade-in",
        className
      )}
      onClick={onClick}
    >
      {image && (
        <div className="aspect-video overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-4">
        {category && (
          <Badge variant="secondary" className="mb-2 text-xs">
            {category}
          </Badge>
        )}
        
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 leading-tight">
          {title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
          {excerpt}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{date}</span>
          </div>
          
          {author && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="truncate">{author}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};