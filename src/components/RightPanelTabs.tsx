
import React from 'react';
import { Button } from '@/components/ui/button';

interface RightPanelTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const RightPanelTabs: React.FC<RightPanelTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'preview', label: 'Preview' },
    { id: 'explorer', label: 'File Explorer' },
    { id: 'editor', label: 'Editor' }
  ];

  return (
    <div className="flex border-b border-border bg-background">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "ghost"}
          size="sm"
          onClick={() => onTabChange(tab.id)}
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
};

export default RightPanelTabs;
