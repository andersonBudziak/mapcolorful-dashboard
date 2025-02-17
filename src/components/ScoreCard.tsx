
import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';

interface ScoreCardProps {
  title: string;
  score: string;
  highlighted?: boolean;
  icon?: ReactNode;
}

const ScoreCard = ({ title, score, highlighted = false, icon }: ScoreCardProps) => {
  return (
    <Card className={`p-4 ${highlighted ? 'bg-[#064C9F] text-white' : 'bg-white'}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon && <div className={`${highlighted ? 'text-white' : 'text-[#064C9F]'}`}>{icon}</div>}
        <h3 className={`font-medium ${highlighted ? 'text-base text-white' : 'text-sm'}`}>{title}</h3>
      </div>
      <p className={`font-semibold ${highlighted ? 'text-2xl text-white' : 'text-xl'}`}>{score}</p>
    </Card>
  );
};

export default ScoreCard;
