
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Assuming you have a Badge component
import { ArrowRight, Copy, Star, Trash2 } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  createdAt: string;
  files: any[];
  lastModified: string;
  isFeatured?: boolean;
}

interface ProjectCardProps {
  project: Project;
  onLoadProject: (projectId: string) => void;
  onDeleteProject: (e: React.MouseEvent, projectId: string) => void;
  onDuplicateProject: (e: React.MouseEvent, project: Project) => void;
  onToggleFeatured: (projectId: string) => void;
  userPlan: string; // To check for project limits on duplication
  projectCount: number; // To check for project limits on duplication
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onLoadProject,
  onDeleteProject,
  onDuplicateProject,
  onToggleFeatured,
}) => {
  return (
    <div
      onClick={() => onLoadProject(project.id)}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-all hover:-translate-y-1 flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-white font-medium text-lg mb-1 pr-2 break-all">{project.name}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFeatured(project.id);
            }}
            className={`p-1 h-7 w-7 ${project.isFeatured ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-400 hover:text-gray-300'}`}
            title={project.isFeatured ? "Unstar project" : "Star project"}
          >
            <Star className={`h-5 w-5 ${project.isFeatured ? 'fill-current' : ''}`} />
          </Button>
        </div>
        <p className="text-gray-400 text-sm">
          Created: {new Date(project.createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-400 text-sm">
          Last Modified: {new Date(project.lastModified).toLocaleDateString()}
        </p>
      </div>
      <div className="flex justify-end items-center mt-4 gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => onDuplicateProject(e, project)}
          className="text-blue-400 hover:text-blue-300 p-1"
          title="Duplicate project"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => onDeleteProject(e, project.id)}
          className="text-red-400 hover:text-red-300 p-1"
          title="Delete project"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-400 hover:text-blue-300 p-1 flex items-center"
          title="Open project"
        >
          <span className="hidden sm:inline mr-1">Open</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;
