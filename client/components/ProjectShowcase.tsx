import { useState, useMemo } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Github, Calendar, Building, Star, Filter } from 'lucide-react';
import { Project } from '@shared/portfolio';

export default function ProjectShowcase() {
  const { data } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
    if (selectedCategory === 'all') return data.projects;
    if (selectedCategory === 'featured') return data.projects.filter(p => p.featured);
    return data.projects.filter(p => p.technologies.includes(selectedCategory));
  }, [data.projects, selectedCategory]);

  const ProjectCard = ({ project }: { project: Project }) => (
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
          
          {(project.link || project.github) && (
            <div className="flex gap-2">
              {project.link && (
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
              {project.github && (
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Github className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        <Badge variant="outline" className="w-fit">
          {project.role}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
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
              onClick={() => setSelectedCategory(tech)}
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

  return (
    <section className="py-20 relative" id="projects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="text-portfolio-blue border-portfolio-blue/20">
            <Filter className="w-3 h-3 mr-1" />
            Portfolio
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Featured <span className="text-portfolio-blue">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A collection of projects showcasing my expertise in full-stack development, 
            IoT solutions, and innovative problem-solving.
          </p>
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
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found for the selected category.</p>
            <Button 
              variant="outline" 
              onClick={() => setSelectedCategory('all')}
              className="mt-4"
            >
              Show All Projects
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
