import { useMemo } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Github, Calendar, Building, Star, ArrowRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '@shared/portfolio';

export default function FeaturedProjectsShowcase() {
  const { data } = usePortfolio();

  // Get top 3 projects (featured first, then by order in array)
  const featuredProjects = useMemo(() => {
    const featured = data.projects.filter(p => p.featured);
    const nonFeatured = data.projects.filter(p => !p.featured);
    const combined = [...featured, ...nonFeatured];
    return combined.slice(0, 3);
  }, [data.projects]);

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
            </div>
          )}
        </div>

        <Badge variant="outline" className="w-fit">
          {project.role}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed line-clamp-2">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((tech) => (
            <Badge 
              key={tech} 
              variant="secondary" 
              className="text-xs"
            >
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{project.technologies.length - 4} more
            </Badge>
          )}
        </div>

        {/* Key Achievement */}
        {project.achievements.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Key Achievement:</h4>
            <div className="text-sm text-muted-foreground flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-portfolio-blue rounded-full mt-2 flex-shrink-0" />
              {project.achievements[0]}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="text-portfolio-blue border-portfolio-blue/20">
            <Filter className="w-3 h-3 mr-1" />
            Featured Work
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Selected <span className="text-portfolio-blue">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Highlighting my most impactful projects in full-stack development, 
            IoT solutions, and innovative problem-solving.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* View All Projects Button */}
        <div className="text-center">
          <Link to="/projects">
            <Button variant="outline" size="lg" className="group">
              View All Projects ({data.projects.length})
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
