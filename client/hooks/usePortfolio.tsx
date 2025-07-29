import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioData, initialPortfolioData, Project, Experience, Skill, updateSkillProjectCounts } from '@shared/portfolio';
import { useAuth } from './useAuth';

interface PortfolioContextType {
  data: PortfolioData;
  updateData: (newData: Partial<PortfolioData>) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addExperience: (experience: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(initialPortfolioData);
  const [isEditing, setIsEditing] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading portfolio data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('portfolioData', JSON.stringify(data));
  }, [data]);

  const updateData = (newData: Partial<PortfolioData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const generateId = () => Date.now().toString();

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = { ...project, id: generateId() };
    setData(prev => {
      const newProjects = [...prev.projects, newProject];
      return {
        ...prev,
        projects: newProjects,
        skills: updateSkillProjectCounts(prev.skills, newProjects)
      };
    });
  };

  const updateProject = (id: string, project: Partial<Project>) => {
    setData(prev => {
      const updatedProjects = prev.projects.map(p => p.id === id ? { ...p, ...project } : p);
      return {
        ...prev,
        projects: updatedProjects,
        skills: updateSkillProjectCounts(prev.skills, updatedProjects)
      };
    });
  };

  const deleteProject = (id: string) => {
    setData(prev => {
      const filteredProjects = prev.projects.filter(p => p.id !== id);
      return {
        ...prev,
        projects: filteredProjects,
        skills: updateSkillProjectCounts(prev.skills, filteredProjects)
      };
    });
  };

  const addExperience = (experience: Omit<Experience, 'id'>) => {
    const newExperience = { ...experience, id: generateId() };
    setData(prev => ({
      ...prev,
      experiences: [...prev.experiences, newExperience]
    }));
  };

  const updateExperience = (id: string, experience: Partial<Experience>) => {
    setData(prev => ({
      ...prev,
      experiences: prev.experiences.map(e => e.id === id ? { ...e, ...experience } : e)
    }));
  };

  const deleteExperience = (id: string) => {
    setData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(e => e.id !== id)
    }));
  };

  const addSkill = (skill: Omit<Skill, 'id'>) => {
    const newSkill = { ...skill, id: generateId() };
    setData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateSkill = (id: string, skill: Partial<Skill>) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, ...skill } : s)
    }));
  };

  const deleteSkill = (id: string) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }));
  };

  return (
    <PortfolioContext.Provider value={{
      data,
      updateData,
      addProject,
      updateProject,
      deleteProject,
      addExperience,
      updateExperience,
      deleteExperience,
      addSkill,
      updateSkill,
      deleteSkill,
      isEditing,
      setIsEditing
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
