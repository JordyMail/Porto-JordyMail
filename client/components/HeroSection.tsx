import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePortfolio } from '@/hooks/usePortfolio';
import { Github, Linkedin, Mail, Phone, MapPin, Download, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const { data } = usePortfolio();
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
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

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    projectsSection?.scrollIntoView({ behavior: 'smooth' });
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

            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {data.personalInfo.summary}
            </p>

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
              
              <Button variant="outline" size="lg" className="group">
                <Download className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                Download CV
              </Button>
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
            <div className="relative">
              {/* Profile Image Placeholder */}
              <div className="w-80 h-80 rounded-2xl bg-gradient-to-br from-portfolio-blue/20 via-portfolio-purple/20 to-portfolio-cyan/20 flex items-center justify-center relative overflow-hidden">
                <div className="w-72 h-72 rounded-xl bg-gradient-to-br from-portfolio-blue to-portfolio-purple flex items-center justify-center text-white text-6xl font-bold">
                  JK
                </div>
                
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
