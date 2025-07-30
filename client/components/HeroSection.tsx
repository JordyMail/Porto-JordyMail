import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useAuth } from '@/hooks/useAuth';
import { Github, Linkedin, Mail, Phone, MapPin, Download, ChevronDown, Edit, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const { data, updateData } = usePortfolio();
  const { isAuthenticated } = useAuth();
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editData, setEditData] = useState({
    avatar: data.personalInfo.avatar || '',
    summary: data.personalInfo.summary,
    cvDownloadLink: data.personalInfo.cvDownloadLink || '',
    customEmailLink: data.personalInfo.customEmailLink || ''
  });
  
  const titles = ['Full-Stack Developer', 'IoT Specialist', 'Problem Solver', 'Tech Innovator'];

  // Typewriter effect
  useEffect(() => {
    const currentTitle = titles[textIndex];
    let index = 0;
    const timer = setInterval(() => {
      setDisplayText(currentTitle.slice(0, index));
      index++;
      if (index > currentTitle.length) {
        setTimeout(() => {
          setTextIndex((prev) => (prev + 1) % titles.length);
        }, 2000);
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [textIndex]);

  // Update editData when data changes
  useEffect(() => {
    setEditData({
      avatar: data.personalInfo.avatar || '',
      summary: data.personalInfo.summary,
      cvDownloadLink: data.personalInfo.cvDownloadLink || '',
      customEmailLink: data.personalInfo.customEmailLink || ''
    });
  }, [data.personalInfo.avatar, data.personalInfo.summary, data.personalInfo.cvDownloadLink, data.personalInfo.customEmailLink]);

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    projectsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSave = () => {
    updateData({
      personalInfo: {
        ...data.personalInfo,
        avatar: editData.avatar.trim() || undefined,
        summary: editData.summary,
        cvDownloadLink: editData.cvDownloadLink.trim() || undefined,
        customEmailLink: editData.customEmailLink.trim() || undefined
      }
    });
    setShowEditDialog(false);
  };

  const handleCancel = () => {
    setEditData({
      avatar: data.personalInfo.avatar || '',
      summary: data.personalInfo.summary,
      cvDownloadLink: data.personalInfo.cvDownloadLink || '',
      customEmailLink: data.personalInfo.customEmailLink || ''
    });
    setShowEditDialog(false);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-portfolio-blue/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge variant="outline" className="text-portfolio-blue border-portfolio-blue/20">
                ✨ Available for Internships
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                Hi, I'm{' '}
                <span className="bg-gradient-to-r from-portfolio-blue via-portfolio-purple to-portfolio-cyan bg-clip-text text-transparent">
                  {data.personalInfo.name.split(' ')[0]}
                </span>
              </h1>
              
              <div className="h-16 flex items-center">
                <span className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground">
                  {displayText}
                  <span className="animate-pulse">|</span>
                </span>
              </div>
            </div>

            {/* Editable Description */}
            <div className="relative group">
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {data.personalInfo.summary}
              </p>
              {isAuthenticated && (
                <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Profile Information</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="avatar">Profile Photo URL (optional)</Label>
                        <Input
                          id="avatar"
                          value={editData.avatar}
                          onChange={(e) => setEditData(prev => ({ ...prev, avatar: e.target.value }))}
                          placeholder="https://example.com/profile-photo.jpg"
                        />
                        {editData.avatar && (
                          <div className="mt-2">
                            <img 
                              src={editData.avatar} 
                              alt="Profile preview" 
                              className="w-20 h-20 object-cover rounded-full border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="summary">About Me / Summary</Label>
                        <Textarea
                          id="summary"
                          value={editData.summary}
                          onChange={(e) => setEditData(prev => ({ ...prev, summary: e.target.value }))}
                          placeholder="Write a brief summary about yourself..."
                          rows={6}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cvDownloadLink">CV Download Link (optional)</Label>
                        <Input
                          id="cvDownloadLink"
                          value={editData.cvDownloadLink}
                          onChange={(e) => setEditData(prev => ({ ...prev, cvDownloadLink: e.target.value }))}
                          placeholder="https://drive.google.com/file/d/your-cv-id/view"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="customEmailLink">Custom Email Link (optional)</Label>
                        <Input
                          id="customEmailLink"
                          value={editData.customEmailLink}
                          onChange={(e) => setEditData(prev => ({ ...prev, customEmailLink: e.target.value }))}
                          placeholder="mailto:your@email.com?subject=Hello&body=Hi there!"
                        />
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
              )}
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-portfolio-blue" />
                {data.personalInfo.location}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-portfolio-blue" />
                {data.personalInfo.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-portfolio-blue" />
                {data.personalInfo.phone}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-portfolio-blue to-portfolio-purple hover:opacity-90 transition-opacity"
                onClick={scrollToProjects}
              >
                View My Work
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>

              <div className="relative group">
                {data.personalInfo.cvDownloadLink ? (
                  <Button
                    variant="outline"
                    size="lg"
                    className="group"
                    asChild
                  >
                    <a href={data.personalInfo.cvDownloadLink} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                      Download CV
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" size="lg" className="group" disabled>
                    <Download className="mr-2 h-4 w-4" />
                    Download CV
                  </Button>
                )}
                {isAuthenticated && (
                  <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-4">
              <a
                href={`https://${data.personalInfo.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-accent hover:bg-portfolio-blue/10 transition-colors group"
              >
                <Github className="h-5 w-5 group-hover:text-portfolio-blue transition-colors" />
              </a>
              <a
                href={`https://${data.personalInfo.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-accent hover:bg-portfolio-blue/10 transition-colors group"
              >
                <Linkedin className="h-5 w-5 group-hover:text-portfolio-blue transition-colors" />
              </a>
              <a
                href={`mailto:${data.personalInfo.email}`}
                className="p-3 rounded-full bg-accent hover:bg-portfolio-blue/10 transition-colors group"
              >
                <Mail className="h-5 w-5 group-hover:text-portfolio-blue transition-colors" />
              </a>
            </div>
          </div>

          {/* Right Column - Visual Elements */}
          <div className="flex justify-center lg:justify-end animate-slide-up">
            <div className="relative group">
              {/* Profile Image */}
              <div className="w-80 h-80 rounded-2xl bg-gradient-to-br from-portfolio-blue/20 via-portfolio-purple/20 to-portfolio-cyan/20 flex items-center justify-center relative overflow-hidden">
                {data.personalInfo.avatar ? (
                  <img 
                    src={data.personalInfo.avatar} 
                    alt={data.personalInfo.name}
                    className="w-72 h-72 rounded-xl object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      // Show fallback
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) {
                        fallback.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                
                {/* Fallback with initials */}
                <div 
                  className="w-72 h-72 rounded-xl bg-gradient-to-br from-portfolio-blue to-portfolio-purple flex items-center justify-center text-white text-6xl font-bold"
                  style={{ display: data.personalInfo.avatar ? 'none' : 'flex' }}
                >
                  {data.personalInfo.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                {/* Edit button for photo */}
                {isAuthenticated && (
                  <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                )}
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-portfolio-orange rounded-full animate-float" />
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-portfolio-cyan rounded-full animate-float" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 -left-6 w-4 h-4 bg-portfolio-purple rounded-full animate-float" style={{ animationDelay: '2s' }} />
              </div>

              {/* Skill badges floating around */}
              <div className="absolute -top-8 left-8 animate-float">
                <Badge className="bg-portfolio-blue/20 text-portfolio-blue border-portfolio-blue/20">
                  React
                </Badge>
              </div>
              <div className="absolute -bottom-8 right-8 animate-float" style={{ animationDelay: '1.5s' }}>
                <Badge className="bg-portfolio-purple/20 text-portfolio-purple border-portfolio-purple/20">
                  Node.js
                </Badge>
              </div>
              <div className="absolute top-16 -right-12 animate-float" style={{ animationDelay: '0.5s' }}>
                <Badge className="bg-portfolio-cyan/20 text-portfolio-cyan border-portfolio-cyan/20">
                  IoT
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-portfolio-blue" />
        </div>
      </div>
    </section>
  );
}
