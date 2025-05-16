
import { useState, useEffect, useCallback } from 'react';

type FileType = {
  name: string;
  content: string;
  type: string;
};

export const useProjectFiles = (initialFiles: FileType[]) => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [currentFile, setCurrentFile] = useState<string>("");
  const [mainPreviewFile, setMainPreviewFile] = useState<string>("");
  
  // Get current project ID
  const getCurrentProjectId = useCallback(() => {
    return localStorage.getItem("current_project_id") || "";
  }, []);
  
  // Get storage key for this project
  const getStorageKey = useCallback((key: string) => {
    const projectId = getCurrentProjectId();
    return projectId ? `${projectId}_${key}` : key;
  }, []);
  
  // Load files from localStorage on initial mount
  useEffect(() => {
    const projectId = getCurrentProjectId();
    
    try {
      // First check for project-specific files
      const savedFiles = localStorage.getItem(getStorageKey("project_files"));
      
      // If no project-specific files, check for general project_files
      const generalFiles = localStorage.getItem("project_files");
      
      if (savedFiles) {
        setFiles(JSON.parse(savedFiles));
      } else if (generalFiles) {
        // Use general files if no project-specific files exist
        const parsedFiles = JSON.parse(generalFiles);
        setFiles(parsedFiles);
        // Save as project-specific files
        localStorage.setItem(getStorageKey("project_files"), generalFiles);
      } else {
        // Use initial files if no saved files exist
        setFiles(initialFiles);
      }
      
      // Load current file
      const lastFile = localStorage.getItem(getStorageKey("current_file")) || 
                       localStorage.getItem("current_file");
      setCurrentFile(lastFile || "index.html");
      
      // Load main preview file
      const mainFile = localStorage.getItem(getStorageKey("main_preview_file")) || 
                       localStorage.getItem("main_preview_file");
      setMainPreviewFile(mainFile || "index.html");
    } catch (error) {
      console.error("Error loading files:", error);
      // Fallback to initial files if error
      setFiles(initialFiles);
      setCurrentFile("index.html");
      setMainPreviewFile("index.html");
    }
  }, [initialFiles, getStorageKey]);
  
  // Save files to localStorage when they change
  useEffect(() => {
    if (files.length > 0 && getCurrentProjectId()) {
      try {
        localStorage.setItem(getStorageKey("project_files"), JSON.stringify(files));
        
        // Update the project in saved_projects
        const savedProjects = localStorage.getItem("saved_projects");
        if (savedProjects) {
          const projects = JSON.parse(savedProjects);
          const projectId = getCurrentProjectId();
          
          const updatedProjects = projects.map((project: any) => {
            if (project.id === projectId) {
              return {
                ...project,
                files: files,
                lastModified: new Date().toISOString()
              };
            }
            return project;
          });
          
          localStorage.setItem("saved_projects", JSON.stringify(updatedProjects));
        }
      } catch (error) {
        console.error("Error saving files:", error);
      }
    }
  }, [files, getStorageKey]);
  
  // Save current file when it changes
  useEffect(() => {
    if (currentFile && getCurrentProjectId()) {
      localStorage.setItem(getStorageKey("current_file"), currentFile);
    }
  }, [currentFile, getStorageKey]);
  
  // Save main preview file when it changes
  useEffect(() => {
    if (mainPreviewFile && getCurrentProjectId()) {
      localStorage.setItem(getStorageKey("main_preview_file"), mainPreviewFile);
    }
  }, [mainPreviewFile, getStorageKey]);
  
  const updateFileContent = useCallback((fileName: string, content: string) => {
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.name === fileName ? { ...file, content } : file
      )
    );
  }, []);
  
  return {
    files,
    setFiles,
    currentFile,
    setCurrentFile,
    mainPreviewFile,
    setMainPreviewFile,
    updateFileContent,
  };
};
