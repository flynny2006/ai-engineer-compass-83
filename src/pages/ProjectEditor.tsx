
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Index from './Index';
import { toast } from '@/hooks/use-toast';
import AiResponseStatus from '@/components/AiResponseStatus';
import { UserData } from '@/components/AuthModal';

const ProjectEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [initializing, setInitializing] = useState(true);
  const [showAiStatus, setShowAiStatus] = useState(false);
  const [aiStatusType, setAiStatusType] = useState<'thinking' | 'building' | 'complete'>('thinking');
  const [user, setUser] = useState<UserData | null>(null);
  const [creditsInfo, setCreditsInfo] = useState({ amount: 0, type: 'daily' as const });

  // Handle AI response simulation
  const simulateAiResponse = () => {
    // Simulate AI thinking and building process
    setShowAiStatus(true);
    setAiStatusType('thinking');
    
    // After 3-4 seconds, change to building
    setTimeout(() => {
      setAiStatusType('building');
      
      // After 2 more seconds, complete
      setTimeout(() => {
        setAiStatusType('complete');
        setShowAiStatus(false);
      }, 2000);
    }, 3000 + Math.random() * 1000); // Random between 3-4 seconds
  };
  
  // Load user data
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      setUser(userData);
      setCreditsInfo({
        amount: userData.credits?.daily || 20,
        type: 'daily'
      });
    }
  }, []);
  
  useEffect(() => {
    // Get project ID from URL parameters
    const queryParams = new URLSearchParams(location.search);
    const projectId = queryParams.get('id');
    
    // If there's a project ID in the URL, set it as current
    if (projectId) {
      // Set the current project ID
      localStorage.setItem("current_project_id", projectId);
      
      // Load project data based on project ID
      const savedProjects = localStorage.getItem("saved_projects");
      if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        const project = projects.find((p: any) => p.id === projectId);
        
        if (project) {
          // Update last accessed timestamp
          const updatedProjects = projects.map((p: any) => 
            p.id === projectId 
              ? { ...p, lastModified: new Date().toISOString() } 
              : p
          );
          localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
          
          // No need to explicitly set project files here - the Index component
          // will handle loading the correct files for the current project
          
          setInitializing(false);
          
          // Simulate AI response when we enter a project
          simulateAiResponse();
        } else {
          toast({
            title: "Project not found",
            description: "The requested project could not be found."
          });
        }
      }
    } else {
      // Check if there's already a current project ID in localStorage
      const currentProjectId = localStorage.getItem("current_project_id");
      
      if (!currentProjectId) {
        // If no project ID found, redirect to homepage
        navigate('/');
        return;
      }
      
      // Update the URL to include the project ID
      navigate(`/project?id=${currentProjectId}`, { replace: true });
      setInitializing(false);
    }

    // Simulate AI response for testing
    const enableSimulation = false; // Set to true to test AI response simulation
    if (enableSimulation) {
      setTimeout(simulateAiResponse, 2000);
    }
  }, [navigate, location.search]);

  // Disable navigation messages
  useEffect(() => {
    // Create style to hide notification boxes
    const style = document.createElement('style');
    style.textContent = `
      .toaster .toast[data-title="Navigation"] {
        display: none !important;
      }
      
      /* Hide all navigation-related toasts */
      .toast-title:contains('Navigation'), 
      div[data-toast-title="Navigation"],
      .sonner-toast:has([data-toast-title="Navigation"]) {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Add event listener for AI response simulation
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Check if the message is from the child iframe
      if (event.data && event.data.type === "ai_request") {
        // Start AI response simulation
        simulateAiResponse();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {showAiStatus && (
        <div className="fixed bottom-4 left-4 bg-black/80 border border-white/20 rounded-lg z-50 text-white shadow-lg">
          <AiResponseStatus isVisible={showAiStatus} status={aiStatusType} />
        </div>
      )}
      <Index creditsInfo={creditsInfo} onAiRequest={simulateAiResponse} />
    </>
  );
};

export default ProjectEditor;
