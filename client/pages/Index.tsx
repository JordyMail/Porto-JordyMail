import { usePortfolio } from '@/hooks/usePortfolio';
import Navigation from '@/components/Navigation';
import ParticleBackground from '@/components/ParticleBackground';
import HeroSection from '@/components/HeroSection';
import FeaturedProjectsShowcase from '@/components/FeaturedProjectsShowcase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Building, GraduationCap, Award, Globe, Mail, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  const { data } = usePortfolio();

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <Navigation />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection />



        {/* Projects Section */}
        <FeaturedProjectsShowcase />

        {/* Experience & Education Section */}
        <section className="py-20 bg-accent/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Experience */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <Badge variant="outline" className="text-portfolio-cyan border-portfolio-cyan/20">
                    🚀 Experience
                  </Badge>
                  <h3 className="text-2xl font-bold">
                    Leadership & <span className="text-portfolio-cyan">Organizations</span>
                  </h3>
                </div>

                <div className="space-y-4">
                  {data.experiences.slice(0, 3).map((exp) => (
                    <Card key={exp.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{exp.title}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Building className="h-4 w-4" />
                              {exp.organization}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Calendar className="h-4 w-4" />
                              {exp.duration}
                            </div>
                          </div>
                          <Badge variant="outline">
                            {exp.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-3">{exp.description}</p>
                        <ul className="space-y-1">
                          {exp.responsibilities.slice(0, 2).map((resp, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-portfolio-cyan rounded-full mt-2 flex-shrink-0" />
                              {resp}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Link to="/experience">
                  <Button variant="outline" className="w-full group">
                    View All Experience ({data.experiences.length})
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              {/* Education & Achievements */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <Badge variant="outline" className="text-portfolio-orange border-portfolio-orange/20">
                    🎓 Education
                  </Badge>
                  <h3 className="text-2xl font-bold">
                    Education & <span className="text-portfolio-orange">Achievements</span>
                  </h3>
                </div>

                {/* Education */}
                {data.education.slice(0, 1).map((edu) => (
                  <Card key={edu.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-portfolio-orange/10 rounded-lg flex items-center justify-center">
                          <GraduationCap className="h-6 w-6 text-portfolio-orange" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{edu.degree}</CardTitle>
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
                  <h4 className="font-semibold">Recent Achievements</h4>
                  {data.achievements.slice(0, 2).map((achievement) => (
                    <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-portfolio-orange/10 rounded-full flex items-center justify-center">
                            <Award className="h-4 w-4 text-portfolio-orange" />
                          </div>
                          <div>
                            <h5 className="font-medium">{achievement.title}</h5>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Languages */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Languages
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.languages.map((lang) => (
                      <Badge key={lang.id} variant="outline" className="capitalize">
                        {lang.name} ({lang.level})
                      </Badge>
                    ))}
                  </div>
                </div>

                <Link to="/experience">
                  <Button variant="outline" className="w-full group">
                    View Complete Profile
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-gradient-to-br from-portfolio-blue/5 to-portfolio-purple/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-4 mb-8">
              <Badge variant="outline" className="text-portfolio-blue border-portfolio-blue/20">
                📬 Get In Touch
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold">
                Let's Work <span className="text-portfolio-blue">Together</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                I'm currently seeking internship opportunities in full-stack development, 
                IoT solutions, and innovative tech projects. Let's connect!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={data.personalInfo.customEmailLink || `mailto:${data.personalInfo.email}`}>
                <Button size="lg" className="bg-gradient-to-r from-portfolio-blue to-portfolio-purple hover:opacity-90">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
              </a>
              <a href={`tel:${data.personalInfo.phone}`}>
                <Button variant="outline" size="lg">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Me
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 {data.personalInfo.name}. Built with passion and modern web technologies.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
