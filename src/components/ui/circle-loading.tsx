
import React from 'react';

interface CircleLoadingProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  className?: string;
}

export const CircleLoading: React.FC<CircleLoadingProps> = ({ 
  size = 24, 
  color = 'currentColor',
  className = '',
  ...props 
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-loader ${className}`}
      {...props}
    >
      <path d="M12 22a10 10 0 1 1 10-10" />
    </svg>
  );
};

export default CircleLoading;
