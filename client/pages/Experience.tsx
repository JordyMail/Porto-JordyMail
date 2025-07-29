import { useState } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import ParticleBackground from '@/components/ParticleBackground';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Calendar, 
  Building, 
  Users, 
  Award, 
  GraduationCap, 
  Plus, 
  Edit, 
  Trash2,
  Filter,
  MapPin
} from 'lucide-react';
import { Experience, Education, Achievement } from '@shared/portfolio';

export default function ExperiencePage() {
  const { data, addExperience, updateExperience, deleteExperience, updateData } = usePortfolio();
  const { isAuthenticated } = useAuth();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [newExperience, setNewExperience] = useState<Omit<Experience, 'id'>>({
    title: '',
    organization: '',
    duration: '',
    description: '',
    responsibilities: [''],
    type: 'work'
  });

  const handleAddExperience = () => {
    if (newExperience.title && newExperience.organization) {
      addExperience({
        ...newExperience,
        responsibilities: newExperience.responsibilities.filter(resp => resp.trim() !== '')
      });
      setNewExperience({
        title: '',
        organization: '',
        duration: '',
        description: '',
        responsibilities: [''],
        type: 'work'
      });
      setShowAddDialog(false);
    }
  };

  const handleEditExperience = (exp: Experience) => {
    setEditingExp(exp);
  };

  const handleUpdateExperience = () => {
    if (editingExp) {
      updateExperience(editingExp.id, {
        ...editingExp,
        responsibilities: editingExp.responsibilities.filter(resp => resp.trim() !== '')
      });
      setEditingExp(null);
    }
  };

  const addResponsibility = (isNew = false) => {
    if (isNew) {
      setNewExperience(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, '']
      }));
    } else if (editingExp) {
      setEditingExp(prev => prev ? ({
        ...prev,
        responsibilities: [...prev.responsibilities, '']
      }) : null);
    }
  };

  const updateResponsibility = (index: number, value: string, isNew = false) => {
    if (isNew) {
      setNewExperience(prev => ({
        ...prev,
        responsibilities: prev.responsibilities.map((resp, i) => i === index ? value : resp)
      }));
    } else if (editingExp) {
      setEditingExp(prev => prev ? ({
        ...prev,
        responsibilities: prev.responsibilities.map((resp, i) => i === index ? value : resp)
      }) : null);
    }
  };

  const filteredExperiences = selectedType === 'all' 
    ? data.experiences 
    : data.experiences.filter(exp => exp.type === selectedType);

  const typeColors = {
    work: 'bg-portfolio-blue',
    event: 'bg-portfolio-purple',
    organization: 'bg-portfolio-cyan'
  };

  const typeLabels = {
    work: 'Work Experience',
    event: 'Event Leadership',
    organization: 'Organizations'
  };

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <Navigation />
      
      <main className="relative z-10 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline" className="text-portfolio-cyan border-portfolio-cyan/20">
              🚀 Experience
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold">
              My <span className="text-portfolio-cyan">Journey</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A timeline of my professional experiences, leadership roles, and organizational involvement.
            </p>
          </div>

          {/* Filters and Add Button */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('all')}
                className={selectedType === 'all' ? 'bg-portfolio-cyan hover:bg-portfolio-cyan/90' : ''}
              >
                <Filter className="h-4 w-4 mr-2" />
                All ({data.experiences.length})
              </Button>
              <Button
                variant={selectedType === 'work' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('work')}
                className={selectedType === 'work' ? 'bg-portfolio-blue hover:bg-portfolio-blue/90' : ''}
              >
                Work ({data.experiences.filter(e => e.type === 'work').length})
              </Button>
              <Button
                variant={selectedType === 'event' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('event')}
                className={selectedType === 'event' ? 'bg-portfolio-purple hover:bg-portfolio-purple/90' : ''}
              >
                Events ({data.experiences.filter(e => e.type === 'event').length})
              </Button>
              <Button
                variant={selectedType === 'organization' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('organization')}
                className={selectedType === 'organization' ? 'bg-portfolio-orange hover:bg-portfolio-orange/90' : ''}
              >
                Organizations ({data.experiences.filter(e => e.type === 'organization').length})
              </Button>
            </div>

            {isAuthenticated && (
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-portfolio-cyan hover:bg-portfolio-cyan/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Experience</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-title">Position/Title</Label>
                        <Input
                          id="new-title"
                          value={newExperience.title}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter position title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-type">Type</Label>
                        <Select
                          value={newExperience.type}
                          onValueChange={(value: 'work' | 'event' | 'organization') => 
                            setNewExperience(prev => ({ ...prev, type: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="work">Work Experience</SelectItem>
                            <SelectItem value="event">Event Leadership</SelectItem>
                            <SelectItem value="organization">Organization</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-org">Organization</Label>
                        <Input
                          id="new-org"
                          value={newExperience.organization}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, organization: e.target.value }))}
                          placeholder="Organization or company"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-duration">Duration</Label>
                        <Input
                          id="new-duration"
                          value={newExperience.duration}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, duration: e.target.value }))}
                          placeholder="e.g., May - July 2025"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-description">Description</Label>
                      <Textarea
                        id="new-description"
                        value={newExperience.description}
                        onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your role and impact..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Responsibilities</Label>
                        <Button type="button" size="sm" variant="outline" onClick={() => addResponsibility(true)}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {newExperience.responsibilities.map((resp, index) => (
                          <Input
                            key={index}
                            value={resp}
                            onChange={(e) => updateResponsibility(index, e.target.value, true)}
                            placeholder="Responsibility or achievement"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleAddExperience} className="flex-1">
                        Add Experience
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

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>

            <div className="space-y-8">
              {filteredExperiences.map((experience, index) => (
                <div key={experience.id} className="relative flex items-start gap-6">
                  {/* Timeline dot */}
                  <div className={`w-4 h-4 rounded-full ${typeColors[experience.type]} border-4 border-background relative z-10`}></div>
                  
                  {/* Content */}
                  <Card className="flex-1 hover:shadow-md transition-shadow group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{experience.title}</CardTitle>
                            <Badge variant="outline" className="capitalize">
                              {typeLabels[experience.type]}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              {experience.organization}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {experience.duration}
                            </div>
                          </div>
                        </div>
                        
                        {isAuthenticated && (
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => handleEditExperience(experience)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Experience</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this experience? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteExperience(experience.id)}
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
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {experience.description}
                      </p>
                      {experience.responsibilities.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">Key Responsibilities:</h4>
                          <ul className="space-y-1">
                            {experience.responsibilities.map((resp, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${typeColors[experience.type]}`} />
                                {resp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div className="mt-20">
            <div className="text-center space-y-4 mb-8">
              <Badge variant="outline" className="text-portfolio-orange border-portfolio-orange/20">
                🎓 Education
              </Badge>
              <h2 className="text-3xl font-bold">
                Education & <span className="text-portfolio-orange">Achievements</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Education Cards */}
              {data.education.map((edu) => (
                <Card key={edu.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-portfolio-orange/10 rounded-lg flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-portfolio-orange" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{edu.degree}</CardTitle>
                        <p className="text-muted-foreground">{edu.field}</p>
                        <p className="text-muted-foreground">{edu.institution}</p>
                        <p className="text-sm text-muted-foreground">{edu.duration}</p>
                        {edu.gpa && (
                          <Badge variant="outline" className="mt-2">
                            GPA: {edu.gpa}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {edu.honors && edu.honors.length > 0 && (
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Honors & Awards:</h4>
                        {edu.honors.map((honor, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-portfolio-orange" />
                            <span className="text-sm">{honor}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}

              {/* Achievements */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Recent Achievements</h3>
                {data.achievements.map((achievement) => (
                  <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-portfolio-orange/10 rounded-full flex items-center justify-center">
                          <Award className="h-4 w-4 text-portfolio-orange" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium">{achievement.title}</h5>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{achievement.date}</span>
                            <span>•</span>
                            <span>{achievement.organization}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Dialog */}
      {editingExp && (
        <Dialog open={!!editingExp} onOpenChange={() => setEditingExp(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Experience</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Position/Title</Label>
                  <Input
                    value={editingExp.title}
                    onChange={(e) => setEditingExp(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={editingExp.type}
                    onValueChange={(value: 'work' | 'event' | 'organization') => 
                      setEditingExp(prev => prev ? ({ ...prev, type: value }) : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work Experience</SelectItem>
                      <SelectItem value="event">Event Leadership</SelectItem>
                      <SelectItem value="organization">Organization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Organization</Label>
                  <Input
                    value={editingExp.organization}
                    onChange={(e) => setEditingExp(prev => prev ? ({ ...prev, organization: e.target.value }) : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input
                    value={editingExp.duration}
                    onChange={(e) => setEditingExp(prev => prev ? ({ ...prev, duration: e.target.value }) : null)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingExp.description}
                  onChange={(e) => setEditingExp(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Responsibilities</Label>
                  <Button type="button" size="sm" variant="outline" onClick={() => addResponsibility(false)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {editingExp.responsibilities.map((resp, index) => (
                    <Input
                      key={index}
                      value={resp}
                      onChange={(e) => updateResponsibility(index, e.target.value, false)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleUpdateExperience} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingExp(null)} className="flex-1">
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
