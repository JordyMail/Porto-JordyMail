import { useState, useMemo } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import ParticleBackground from '@/components/ParticleBackground';
import SkillsRadar from '@/components/SkillsRadar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { 
  Plus, 
  Edit, 
  Trash2, 
  Code, 
  Server, 
  Smartphone, 
  Settings, 
  Palette, 
  Brain,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Skill } from '@shared/portfolio';

const categoryIcons = {
  frontend: Code,
  backend: Server,
  mobile: Smartphone,
  devops: Settings,
  design: Palette,
  other: Brain
};

const categoryColors = {
  frontend: 'text-portfolio-blue bg-portfolio-blue/10',
  backend: 'text-portfolio-purple bg-portfolio-purple/10',
  mobile: 'text-portfolio-orange bg-portfolio-orange/10',
  devops: 'text-portfolio-cyan bg-portfolio-cyan/10',
  design: 'text-yellow-600 bg-yellow-100',
  other: 'text-green-600 bg-green-100'
};

export default function SkillsPage() {
  const { data, addSkill, updateSkill, deleteSkill } = usePortfolio();
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [newSkill, setNewSkill] = useState<Omit<Skill, 'id'>>({
    name: '',
    level: 5,
    category: 'frontend'
  });

  // Function to calculate how many projects use a specific skill
  const getProjectCountForSkill = (skillName: string): number => {
    return data.projects.filter(project =>
      project.technologies.some(tech =>
        tech.toLowerCase().includes(skillName.toLowerCase()) ||
        skillName.toLowerCase().includes(tech.toLowerCase())
      )
    ).length;
  };

  const skillsByCategory = useMemo(() => {
    const categories = {
      frontend: data.skills.filter(s => s.category === 'frontend'),
      backend: data.skills.filter(s => s.category === 'backend'),
      mobile: data.skills.filter(s => s.category === 'mobile'),
      devops: data.skills.filter(s => s.category === 'devops'),
      design: data.skills.filter(s => s.category === 'design'),
      other: data.skills.filter(s => s.category === 'other')
    };
    return categories;
  }, [data.skills]);

  const filteredSkills = selectedCategory === 'all' 
    ? data.skills 
    : data.skills.filter(skill => skill.category === selectedCategory);

  const handleAddSkill = () => {
    if (newSkill.name) {
      addSkill(newSkill);
      setNewSkill({
        name: '',
        level: 5,
        category: 'frontend'
      });
      setShowAddDialog(false);
    }
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
  };

  const handleUpdateSkill = () => {
    if (editingSkill) {
      updateSkill(editingSkill.id, editingSkill);
      setEditingSkill(null);
    }
  };

  const getProjectCountColor = (count: number) => {
    if (count >= 3) return 'bg-green-500';
    if (count >= 2) return 'bg-yellow-500';
    if (count >= 1) return 'bg-orange-500';
    return 'bg-gray-400';
  };

  const categoryOptions = [
    { value: 'all', label: 'All Skills', count: data.skills.length },
    { value: 'frontend', label: 'Frontend', count: skillsByCategory.frontend.length },
    { value: 'backend', label: 'Backend', count: skillsByCategory.backend.length },
    { value: 'mobile', label: 'Mobile', count: skillsByCategory.mobile.length },
    { value: 'devops', label: 'DevOps', count: skillsByCategory.devops.length },
    { value: 'design', label: 'Design', count: skillsByCategory.design.length },
    { value: 'other', label: 'Other', count: skillsByCategory.other.length }
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <Navigation />
      
      <main className="relative z-10 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline" className="text-portfolio-purple border-portfolio-purple/20">
              💡 Technical Skills
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold">
              Skills & <span className="text-portfolio-purple">Expertise</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Interactive visualization of my technical capabilities across different domains and technologies.
            </p>
          </div>



          {/* Category Filters and Add Button */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex gap-2 flex-wrap">
              {categoryOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedCategory === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(option.value)}
                  className={selectedCategory === option.value ? 'bg-portfolio-purple hover:bg-portfolio-purple/90' : ''}
                >
                  {option.label} ({option.count})
                </Button>
              ))}
            </div>

            {isAuthenticated && (
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-portfolio-purple hover:bg-portfolio-purple/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Skill</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-skill-name">Skill Name</Label>
                      <Input
                        id="new-skill-name"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., React, Node.js, Python"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-skill-category">Category</Label>
                      <Select
                        value={newSkill.category}
                        onValueChange={(value: Skill['category']) => 
                          setNewSkill(prev => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="frontend">Frontend</SelectItem>
                          <SelectItem value="backend">Backend</SelectItem>
                          <SelectItem value="mobile">Mobile</SelectItem>
                          <SelectItem value="devops">DevOps</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Project Count</Label>
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm text-muted-foreground">
                          Project count will be automatically calculated based on how many projects use this skill in their technologies.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleAddSkill} className="flex-1">
                        Add Skill
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

          {/* Skills Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSkills.map((skill) => {
              const IconComponent = categoryIcons[skill.category];
              return (
                <Card key={skill.id} className="group hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryColors[skill.category]}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{skill.name}</h3>
                          <Badge variant="outline" className="text-xs capitalize">
                            {skill.category}
                          </Badge>
                        </div>
                      </div>

                      {isAuthenticated && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => handleEditSkill(skill)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Skill</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{skill.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteSkill(skill.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Projects Used</span>
                        <span className="font-medium">{getProjectCountForSkill(skill.name)} project{getProjectCountForSkill(skill.name) !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="w-full bg-accent rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getProjectCountColor(getProjectCountForSkill(skill.name))}`}
                          style={{ width: `${Math.min(getProjectCountForSkill(skill.name) * 20, 100)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredSkills.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No skills found for the selected category.</p>
              <Button 
                variant="outline" 
                onClick={() => setSelectedCategory('all')}
              >
                Show All Skills
              </Button>
            </div>
          )}

          {/* Skills Summary */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-portfolio-blue/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-portfolio-blue" />
                </div>
                <h3 className="font-semibold mb-2">Total Skills</h3>
                <p className="text-2xl font-bold text-portfolio-blue">{data.skills.length}</p>
                <p className="text-sm text-muted-foreground">Across multiple domains</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-portfolio-purple/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="h-6 w-6 text-portfolio-purple" />
                </div>
                <h3 className="font-semibold mb-2">Most Used Skills</h3>
                <p className="text-2xl font-bold text-portfolio-purple">
                  {Math.max(...data.skills.map(skill => getProjectCountForSkill(skill.name)))}
                </p>
                <p className="text-sm text-muted-foreground">Max projects per skill</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-portfolio-cyan/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Brain className="h-6 w-6 text-portfolio-cyan" />
                </div>
                <h3 className="font-semibold mb-2">Frequently Used</h3>
                <p className="text-2xl font-bold text-portfolio-cyan">
                  {data.skills.filter(skill => getProjectCountForSkill(skill.name) >= 2).length}
                </p>
                <p className="text-sm text-muted-foreground">Skills in 2+ projects</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Edit Dialog */}
      {editingSkill && (
        <Dialog open={!!editingSkill} onOpenChange={() => setEditingSkill(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Skill</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Skill Name</Label>
                <Input
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={editingSkill.category}
                  onValueChange={(value: Skill['category']) => 
                    setEditingSkill(prev => prev ? ({ ...prev, category: value }) : null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend</SelectItem>
                    <SelectItem value="backend">Backend</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="devops">DevOps</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Current Project Count</Label>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">
                    This skill is currently used in <span className="font-medium">{getProjectCountForSkill(editingSkill.name)}</span> project{getProjectCountForSkill(editingSkill.name) !== 1 ? 's' : ''}.
                    Count is automatically calculated based on project technologies.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleUpdateSkill} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingSkill(null)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
