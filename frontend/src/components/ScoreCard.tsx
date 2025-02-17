
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ScoreCardProps {
  title: string;
  score: string;
  highlighted?: boolean;
  description?: string;
}

const ScoreCard = ({ 
  title, 
  score, 
  highlighted = false,
  description
}: ScoreCardProps) => {
  return (
    <Card className={cn(
      "p-4 text-center transition-all duration-300 hover:shadow-merx",
      highlighted ? "bg-merx-primary text-white" : "bg-white border-merx-border"
    )}>
      <h3 className={cn(
        "text-sm font-semibold mb-2",
        highlighted ? "text-white" : "text-merx-text"
      )}>
        {title}
      </h3>
      <p className={cn(
        "text-3xl font-bold mb-1",
        highlighted ? "text-white" : "text-merx-primary"
      )}>
        {score}
      </p>
      {description && (
        <p className={cn(
          "text-xs",
          highlighted ? "text-white/80" : "text-merx-secondary/80"
        )}>
          {description}
        </p>
      )}
    </Card>
  );
};

export default ScoreCard;
