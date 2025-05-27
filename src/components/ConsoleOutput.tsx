
import React from 'react';

interface ConsoleEntry {
  id: string;
  timestamp: string;
  command?: string;
  output: string | React.ReactNode;
  type: 'command' | 'output' | 'error' | 'system';
}

interface ConsoleOutputProps {
  history: ConsoleEntry[];
}

const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ history }) => {
  return (
    <div className="h-full overflow-y-auto p-4 font-mono text-sm leading-normal text-foreground bg-muted/20 dark:bg-black/30 rounded-t-md flex-grow">
      {history.map((entry) => (
        <div key={entry.id} className="mb-1.5">
          <span className="text-muted-foreground mr-2 select-none">{entry.timestamp}</span>
          {entry.type === 'command' && <span className="text-blue-400 dark:text-blue-300 mr-1 select-none">$</span>}
          <span
            className={
              entry.type === 'error' ? 'text-red-500 dark:text-red-400' :
              entry.type === 'system' ? 'text-green-500 dark:text-green-400' :
              entry.type === 'command' ? 'text-foreground' :
              'text-muted-foreground' /* Regular output */
            }
          >
            {entry.command && `${entry.command} `}
            {entry.output}
          </span>
        </div>
      ))}
       <div id="console-bottom" /> {/* Scroll anchor */}
    </div>
  );
};

export default ConsoleOutput;

