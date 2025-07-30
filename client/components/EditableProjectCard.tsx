import { useState } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useAuth } from '@/hooks/useAuth';
import { Project } from '@shared/portfolio';
import ProjectImageCarousel from '@/components/ProjectImageCarousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, ExternalLink, Github, Star, Calendar, Building, Plus } from 'lucide-react';

interface EditableProjectCardProps {
  project: Project;
}

export default function EditableProjectCard({ project }: EditableProjectCardProps) {
  const { updateProject, deleteProject } = usePortfolio();
  const { isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Project>(project);

  const handleSave = () => {
    updateProject(project.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(project);
    setIsEditing(false);
  };

  const addTechnology = () => {
    setEditData(prev => ({
      ...prev,
      technologies: [...prev.technologies, '']
    }));
  };

  const updateTechnology = (index: number, value: string) => {
    setEditData(prev => ({
      ...prev,
      technologies: prev.technologies.map((tech, i) => i === index ? value : tech)
    }));
  };

  const removeTechnology = (index: number) => {
    setEditData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  const addAchievement = () => {
    setEditData(prev => ({
      ...prev,
      achievements: [...prev.achievements, '']
    }));
  };

  const updateAchievement = (index: number, value: string) => {
    setEditData(prev => ({
      ...prev,
      achievements: prev.achievements.map((ach, i) => i === index ? value : ach)
    }));
  };

  const removeAchievement = (index: number) => {
    setEditData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const addImage = () => {
    setEditData(prev => ({
      ...prev,
      images: [...(prev.images || []), '']
    }));
  };

  const updateImage = (index: number, value: string) => {
    setEditData(prev => ({
      ...prev,
      images: (prev.images || []).map((img, i) => i === index ? value : img)
    }));
  };

  const removeImage = (index: number) => {
    setEditData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  if (isEditing) {
    return (
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={editData.title}
                  onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={editData.role}
                  onChange={(e) => setEditData(prev => ({ ...prev, role: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={editData.organization}
                  onChange={(e) => setEditData(prev => ({ ...prev, organization: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={editData.duration}
                  onChange={(e) => setEditData(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editData.description}
                onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="link">Project Link (optional)</Label>
                <Input
                  id="link"
                  value={editData.link || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub Link (optional)</Label>
                <Input
                  id="github"
                  value={editData.github || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, github: e.target.value }))}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Project Images (optional, max 5)</Label>
                <Button type="button" size="sm" variant="outline" onClick={addImage}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Image
                </Button>
              </div>
              <div className="space-y-2">
                {(editData.images || []).map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={image}
                      onChange={(e) => updateImage(index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {editData.images && editData.images.length > 0 && (
                <div className="mt-2">
                  <ProjectImageCarousel images={editData.images} title={editData.title} />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={editData.featured || false}
                onCheckedChange={(checked) => setEditData(prev => ({ ...prev, featured: checked }))}
              />
              <Label htmlFor="featured">Featured Project</Label>
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
                {editData.technologies.map((tech, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={tech}
                      onChange={(e) => updateTechnology(index, e.target.value)}
                      placeholder="Technology name"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTechnology(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
                {editData.achievements.map((achievement, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={achievement}
                      onChange={(e) => updateAchievement(index, e.target.value)}
                      placeholder="Achievement description"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAchievement(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="group-hover:text-portfolio-blue transition-colors">
              {project.title}
              {project.featured && (
                <Star className="inline ml-2 h-4 w-4 text-portfolio-orange fill-current" />
              )}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building className="h-4 w-4" />
              {project.organization}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {project.duration}
            </div>
          </div>
          
          <div className="flex gap-2">
            {project.link && (
              <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            {project.github && (
              <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
            {isAuthenticated && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Project</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{project.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteProject(project.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>

        <Badge variant="outline" className="w-fit">
          {project.role}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Project Images */}
        {project.images && project.images.length > 0 && (
          <ProjectImageCarousel images={project.images} title={project.title} />
        )}

        <p className="text-muted-foreground leading-relaxed">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge 
              key={tech} 
              variant="secondary" 
              className="text-xs hover:bg-portfolio-blue/10 hover:text-portfolio-blue cursor-pointer transition-colors"
            >
              {tech}
            </Badge>
          ))}
        </div>

        {/* Achievements */}
        {project.achievements.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Key Achievements:</h4>
            <ul className="space-y-1">
              {project.achievements.map((achievement, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-portfolio-blue rounded-full mt-2 flex-shrink-0" />
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
