import React, { useState, useEffect, useCallback, useRef } from 'react';
import ConsoleOutput from './ConsoleOutput';
import ConsoleInput from './ConsoleInput';
import { v4 as uuidv4 } from 'uuid';

interface ConsoleEntry {
  id: string;
  timestamp: string;
  command?: string;
  output: string | React.ReactNode;
  type: 'command' | 'output' | 'error' | 'system';
}

interface ProjectConsoleProps {
  projectId: string | null;
  isAiThinking: boolean; // To simulate 'npm install preview'
  onClearProjectFiles?: () => void; // Placeholder for boongle --clearproject
}

const ProjectConsole: React.FC<ProjectConsoleProps> = ({ projectId, isAiThinking, onClearProjectFiles }) => {
  const [history, setHistory] = useState<ConsoleEntry[]>([]);
  const [commandOnlyHistory, setCommandOnlyHistory] = useState<string[]>([]);
  const outputEndRef = useRef<HTMLDivElement>(null);

  const getFormattedTimestamp = () => new Date().toLocaleTimeString();

  const addHistoryEntry = useCallback((entry: Omit<ConsoleEntry, 'id' | 'timestamp'>) => {
    setHistory(prev => [...prev, { ...entry, id: uuidv4(), timestamp: getFormattedTimestamp() }]);
    if (entry.type === 'command' && entry.command) {
        setCommandOnlyHistory(prev => [entry.command!, ...prev].slice(0, 50)); // Keep last 50 commands
    }
  }, []);
  
  // Load history from localStorage
  useEffect(() => {
    if (projectId) {
      const savedHistory = localStorage.getItem(`console_history_${projectId}`);
      const savedCommandOnlyHistory = localStorage.getItem(`console_cmd_history_${projectId}`);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      } else {
         addHistoryEntry({ output: "Welcome to the Project Console! Type 'help' for commands.", type: 'system' });
      }
      if (savedCommandOnlyHistory) {
        setCommandOnlyHistory(JSON.parse(savedCommandOnlyHistory));
      }
    }
  }, [projectId, addHistoryEntry]);

  // Save history to localStorage
  useEffect(() => {
    if (projectId) {
      localStorage.setItem(`console_history_${projectId}`, JSON.stringify(history));
      localStorage.setItem(`console_cmd_history_${projectId}`, JSON.stringify(commandOnlyHistory));
    }
  }, [history, commandOnlyHistory, projectId]);
  
  // Scroll to bottom
  useEffect(() => {
    const anchor = document.getElementById('console-bottom');
    if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  // Simulate 'npm install preview' when AI is thinking
  useEffect(() => {
    if (isAiThinking) {
      addHistoryEntry({ output: 'Running: npm install preview...', type: 'system' });
      setTimeout(() => {
        addHistoryEntry({ output: '[+] Module "previewer" got installed!', type: 'system' });
      }, 1500); // Simulate install time
    }
  }, [isAiThinking, addHistoryEntry]);


  const handleCommand = (command: string) => {
    addHistoryEntry({ command, output: '', type: 'command' });

    const [cmd, ...args] = command.toLowerCase().split(' ');

    switch (cmd) {
      case 'help':
        addHistoryEntry({ output: (
            <div>
                <p>Available commands:</p>
                <ul className="list-disc list-inside ml-4">
                    <li><span className="text-primary">help</span> - Show this help message.</li>
                    <li><span className="text-primary">clear</span> - Clear the console history.</li>
                    <li><span className="text-primary">echo [message]</span> - Print message to console.</li>
                    <li><span className="text-primary">boongle --clearproject</span> - (Simulation) Clears project files.</li>
                    <li><span className="text-primary">date</span> - Show current date and time.</li>
                </ul>
            </div>
        ), type: 'output' });
        break;
      case 'clear':
        setHistory([]);
        // Keep one welcome message or command prompt
        addHistoryEntry({ output: "Console cleared. Type 'help' for commands.", type: 'system' });
        break;
      case 'echo':
        addHistoryEntry({ output: args.join(' ') || "echo: missing message", type: 'output' });
        break;
      case 'boongle':
        if (args[0] === '--clearproject') {
          addHistoryEntry({ output: 'Simulating: Clearing project files...', type: 'system' });
          if (onClearProjectFiles) onClearProjectFiles(); // Call actual function if provided
           setTimeout(() => {
            addHistoryEntry({ output: 'Project files cleared (simulation).', type: 'system' });
          }, 1000);
        } else {
          addHistoryEntry({ output: `boongle: unknown argument '${args[0]}'. Try 'boongle --clearproject'`, type: 'error' });
        }
        break;
      case 'date':
        addHistoryEntry({ output: new Date().toString(), type: 'output' });
        break;
      default:
        addHistoryEntry({ output: `Command not found: ${command}`, type: 'error' });
    }
  };

  if (!projectId) {
    return <div className="p-4 text-muted-foreground">Loading project console...</div>;
  }

  return (
    <div className="h-full flex flex-col bg-card border border-border rounded-lg shadow-sm">
      <ConsoleOutput history={history} />
      <ConsoleInput onCommand={handleCommand} commandHistory={commandOnlyHistory} />
    </div>
  );
};

export default ProjectConsole;
