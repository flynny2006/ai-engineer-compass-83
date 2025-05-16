
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Index from './Index';

const ProjectEditor = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if there's a current project
    const currentProjectId = localStorage.getItem("current_project_id");
    
    if (!currentProjectId) {
      // If no current project, redirect to homepage
      navigate('/');
    }
  }, [navigate]);

  return <Index />;
};

export default ProjectEditor;
