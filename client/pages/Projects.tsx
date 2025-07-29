import { useState, useMemo } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import ParticleBackground from '@/components/ParticleBackground';
import EditableProjectCard from '@/components/EditableProjectCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Filter, Search } from 'lucide-react';
import { Project } from '@shared/portfolio';

export default function Projects() {
  const { data, addProject } = usePortfolio();
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    title: '',
    role: '',
    organization: '',
    duration: '',
    description: '',
    technologies: [''],
    achievements: [''],
    featured: false
  });

  // Extract unique technologies for filtering
  const allTechnologies = useMemo(() => {
    const techs = new Set<string>();
    data.projects.forEach(project => {
      project.technologies.forEach(tech => techs.add(tech));
    });
    return Array.from(techs).sort();
  }, [data.projects]);

  const categories = [
    { id: 'all', label: 'All Projects', count: data.projects.length },
    { id: 'featured', label: 'Featured', count: data.projects.filter(p => p.featured).length },
    ...allTechnologies.slice(0, 5).map(tech => ({
      id: tech,
      label: tech,
      count: data.projects.filter(p => p.technologies.includes(tech)).length
    }))
  ];

  const filteredProjects = useMemo(() => {
    let filtered = data.projects;

    // Filter by category
    if (selectedCategory === 'featured') {
      filtered = filtered.filter(p => p.featured);
    } else if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.technologies.includes(selectedCategory));
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  }, [data.projects, selectedCategory, searchQuery]);

  const handleAddProject = () => {
    if (newProject.title && newProject.description) {
      addProject({
        ...newProject,
        technologies: newProject.technologies.filter(tech => tech.trim() !== ''),
        achievements: newProject.achievements.filter(ach => ach.trim() !== '')
      });
      setNewProject({
        title: '',
        role: '',
        organization: '',
        duration: '',
        description: '',
        technologies: [''],
        achievements: [''],
        featured: false
      });
      setShowAddDialog(false);
    }
  };

  const addTechnology = () => {
    setNewProject(prev => ({
      ...prev,
      technologies: [...prev.technologies, '']
    }));
  };

  const updateTechnology = (index: number, value: string) => {
    setNewProject(prev => ({
      ...prev,
      technologies: prev.technologies.map((tech, i) => i === index ? value : tech)
    }));
  };

  const addAchievement = () => {
    setNewProject(prev => ({
      ...prev,
      achievements: [...prev.achievements, '']
    }));
  };

  const updateAchievement = (index: number, value: string) => {
    setNewProject(prev => ({
      ...prev,
      achievements: prev.achievements.map((ach, i) => i === index ? value : ach)
    }));
  };

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <Navigation />
      
      <main className="relative z-10 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline" className="text-portfolio-blue border-portfolio-blue/20">
              <Filter className="w-3 h-3 mr-1" />
              Portfolio
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold">
              My <span className="text-portfolio-blue">Projects</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A comprehensive collection of projects showcasing my expertise in full-stack development, 
              IoT solutions, and innovative problem-solving.
            </p>
          </div>

          {/* Search and Add */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {isAuthenticated && (
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-portfolio-blue hover:bg-portfolio-blue/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Project</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-title">Project Title</Label>
                        <Input
                          id="new-title"
                          value={newProject.title}
                          onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter project title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-role">Role</Label>
                        <Input
                          id="new-role"
                          value={newProject.role}
                          onChange={(e) => setNewProject(prev => ({ ...prev, role: e.target.value }))}
                          placeholder="Your role in the project"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-org">Organization</Label>
                        <Input
                          id="new-org"
                          value={newProject.organization}
                          onChange={(e) => setNewProject(prev => ({ ...prev, organization: e.target.value }))}
                          placeholder="Organization or company"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-duration">Duration</Label>
                        <Input
                          id="new-duration"
                          value={newProject.duration}
                          onChange={(e) => setNewProject(prev => ({ ...prev, duration: e.target.value }))}
                          placeholder="e.g., Mar - May 2025"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-description">Description</Label>
                      <Textarea
                        id="new-description"
                        value={newProject.description}
                        onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the project..."
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="new-featured"
                        checked={newProject.featured}
                        onCheckedChange={(checked) => setNewProject(prev => ({ ...prev, featured: checked }))}
                      />
                      <Label htmlFor="new-featured">Featured Project</Label>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Technologies</Label>
                        <Button type="button" size="sm" variant="outline" onClick={addTechnology}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {newProject.technologies.map((tech, index) => (
                          <Input
                            key={index}
                            value={tech}
                            onChange={(e) => updateTechnology(index, e.target.value)}
                            placeholder="Technology name"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Achievements</Label>
                        <Button type="button" size="sm" variant="outline" onClick={addAchievement}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {newProject.achievements.map((achievement, index) => (
                          <Input
                            key={index}
                            value={achievement}
                            onChange={(e) => updateAchievement(index, e.target.value)}
                            placeholder="Achievement description"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleAddProject} className="flex-1">
                        Add Project
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-portfolio-blue hover:bg-portfolio-blue/90" : ""}
              >
                {category.label}
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <EditableProjectCard key={project.id} project={project} />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'No projects found matching your search.' : 'No projects found for the selected category.'}
              </p>
              <div className="flex gap-4 justify-center">
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCategory('all')}
                >
                  Show All Projects
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
