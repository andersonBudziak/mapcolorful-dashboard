
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
      "p-4 text-center transition-all duration-300 hover:shadow-lg",
      highlighted ? "bg-[#2980E8] text-white" : "bg-[#F3F4F6]"
    )}>
      <h3 className={cn(
        "text-sm font-medium mb-2",
        highlighted ? "text-white" : "text-[#1F2937]"
      )}>
        {title}
      </h3>
      <p className={cn(
        "text-3xl font-bold mb-1",
        highlighted ? "text-white" : "text-[#064C9F]"
      )}>
        {score}
      </p>
      {description && (
        <p className={cn(
          "text-xs",
          highlighted ? "text-white/80" : "text-[#1F2937]/80"
        )}>
          {description}
        </p>
      )}
    </Card>
  );
};

export default ScoreCard;
