
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ScoreCardProps {
  title: string;
  score: string;
  highlighted?: boolean;
}

const ScoreCard = ({ title, score, highlighted = false }: ScoreCardProps) => {
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
        "text-2xl font-bold",
        highlighted ? "text-white" : "text-[#064C9F]"
      )}>
        {score}
      </p>
    </Card>
  );
};

export default ScoreCard;
