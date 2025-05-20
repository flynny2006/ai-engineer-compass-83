
import React from 'react';

interface CreditsDisplayProps {
  amount: number;
  type: "daily" | "monthly";
}

const CreditsDisplay: React.FC<CreditsDisplayProps> = ({ amount, type }) => {
  return (
    <div className="text-xs text-muted-foreground mb-1 px-1">
      <span className="font-medium">{amount}</span> {type} credits left
    </div>
  );
};

export default CreditsDisplay;
