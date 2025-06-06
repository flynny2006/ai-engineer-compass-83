
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TabType = 'preview' | 'explorer' | 'editor';

interface RightPanelTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const RightPanelTabs: React.FC<RightPanelTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'preview' as const, label: 'Preview' },
    { id: 'explorer' as const, label: 'File Explorer' },
    { id: 'editor' as const, label: 'Editor' },
  ];

  return (
    <div className="flex border-b border-border bg-background">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          size="sm"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium transition-colors",
            activeTab === tab.id
              ? "border-primary text-primary bg-background"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
};

export default RightPanelTabs;
