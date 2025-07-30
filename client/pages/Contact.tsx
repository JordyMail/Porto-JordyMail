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
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Send,
  MessageSquare,
  Clock,
  Calendar,
  Download,
  ExternalLink,
  Globe,
  Edit
} from 'lucide-react';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'general' | 'collaboration' | 'internship' | 'freelance';
}

export default function ContactPage() {
  const { data, updateData } = usePortfolio();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCvEditDialog, setShowCvEditDialog] = useState(false);
  const [cvLink, setCvLink] = useState(data.personalInfo.cvDownloadLink || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create mailto link with form data
      const emailBody = `
Name: ${formData.name}
Email: ${formData.email}
Type: ${formData.type}
Subject: ${formData.subject}

Message:
${formData.message}
      `.trim();

      const mailtoLink = `mailto:${data.personalInfo.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(emailBody)}`;

      // Open email client
      window.location.href = mailtoLink;

      toast({
        title: "Email client opened!",
        description: "Your email client should open with the pre-filled message. Please send it from there.",
      });

      // Clear form after a short delay
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          type: 'general'
        });
      }, 1000);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open email client. Please try sending an email manually.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveCvLink = () => {
    updateData({
      personalInfo: {
        ...data.personalInfo,
        cvDownloadLink: cvLink.trim() || undefined
      }
    });
    setShowCvEditDialog(false);
  };

  const handleCancelCvEdit = () => {
    setCvLink(data.personalInfo.cvDownloadLink || '');
    setShowCvEditDialog(false);
  };

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: data.personalInfo.email,
      href: `mailto:${data.personalInfo.email}`,
      color: 'text-portfolio-blue bg-portfolio-blue/10',
      description: 'Best for detailed inquiries'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: data.personalInfo.phone,
      href: `tel:${data.personalInfo.phone}`,
      color: 'text-portfolio-purple bg-portfolio-purple/10',
      description: 'For urgent matters'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Professional Network',
      href: `https://${data.personalInfo.linkedin}`,
      color: 'text-portfolio-cyan bg-portfolio-cyan/10',
      description: 'Connect professionally'
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'View Code',
      href: `https://${data.personalInfo.github}`,
      color: 'text-portfolio-orange bg-portfolio-orange/10',
      description: 'Check out my projects'
    }
  ];

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry', icon: MessageSquare },
    { value: 'collaboration', label: 'Project Collaboration', icon: Globe },
    { value: 'internship', label: 'Internship Opportunity', icon: Calendar },
    { value: 'freelance', label: 'Freelance Work', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <Navigation />
      
      <main className="relative z-10 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline" className="text-portfolio-blue border-portfolio-blue/20">
              📬 Get In Touch
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold">
              Let's Work <span className="text-portfolio-blue">Together</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              I'm currently seeking internship opportunities in full-stack development, 
              IoT solutions, and innovative tech projects. Let's connect and create something amazing!
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-portfolio-blue" />
                    Send Me a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Inquiry Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: ContactForm['type']) => handleInputChange('type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {inquiryTypes.map((type) => {
                            const IconComponent = type.icon;
                            return (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <IconComponent className="h-4 w-4" />
                                  {type.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="Brief description of your inquiry"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Tell me more about your project, opportunity, or question..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-portfolio-blue to-portfolio-purple hover:opacity-90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Quick Contact */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Quick Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactMethods.map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <a
                        key={method.label}
                        href={method.href}
                        target={method.label === 'LinkedIn' || method.label === 'GitHub' ? '_blank' : undefined}
                        rel={method.label === 'LinkedIn' || method.label === 'GitHub' ? 'noopener noreferrer' : undefined}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${method.color}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium group-hover:text-portfolio-blue transition-colors">
                            {method.label}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {method.value}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-portfolio-blue transition-colors opacity-0 group-hover:opacity-100" />
                      </a>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Location & Availability */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Location & Availability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-portfolio-cyan/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-portfolio-cyan" />
                    </div>
                    <div>
                      <p className="font-medium">{data.personalInfo.location}</p>
                      <p className="text-sm text-muted-foreground">Indonesia (GMT+7)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <div>
                      <p className="font-medium text-green-600">Available for Internships</p>
                      <p className="text-sm text-muted-foreground">Full-time & Part-time</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-portfolio-orange/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-portfolio-orange" />
                    </div>
                    <div>
                      <p className="font-medium">Response Time</p>
                      <p className="text-sm text-muted-foreground">Usually within 24 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Download CV */}
              <Card className="bg-gradient-to-br from-portfolio-blue/5 to-portfolio-purple/5 border-portfolio-blue/20 relative group">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-portfolio-blue/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Download className="h-6 w-6 text-portfolio-blue" />
                  </div>
                  <h3 className="font-semibold mb-2">Download My CV</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get the complete overview of my experience and skills
                  </p>
                  {data.personalInfo.cvDownloadLink ? (
                    <Button
                      variant="outline"
                      className="w-full border-portfolio-blue text-portfolio-blue hover:bg-portfolio-blue hover:text-white"
                      asChild
                    >
                      <a href={data.personalInfo.cvDownloadLink} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download CV
                      </a>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full border-portfolio-blue text-portfolio-blue opacity-50"
                      disabled
                    >
                      <Download className="h-4 w-4 mr-2" />
                      CV Link Not Set
                    </Button>
                  )}

                  {isAuthenticated && (
                    <Dialog open={showCvEditDialog} onOpenChange={setShowCvEditDialog}>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit CV Download Link</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="cv-link">CV Download URL</Label>
                            <Input
                              id="cv-link"
                              value={cvLink}
                              onChange={(e) => setCvLink(e.target.value)}
                              placeholder="https://drive.google.com/file/d/your-cv-id/view"
                            />
                          </div>
                          <div className="flex gap-3 pt-4">
                            <Button onClick={handleSaveCvLink} className="flex-1">
                              Save
                            </Button>
                            <Button variant="outline" onClick={handleCancelCvEdit} className="flex-1">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>

              {/* Languages */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.languages.map((lang) => (
                      <div key={lang.id} className="flex items-center justify-between">
                        <span className="font-medium">{lang.name}</span>
                        <Badge 
                          variant="outline" 
                          className={`capitalize ${
                            lang.level === 'native' ? 'border-green-500 text-green-700' :
                            lang.level === 'advanced' ? 'border-blue-500 text-blue-700' :
                            lang.level === 'intermediate' ? 'border-yellow-500 text-yellow-700' :
                            'border-gray-500 text-gray-700'
                          }`}
                        >
                          {lang.level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-3xl font-bold">
                Frequently Asked <span className="text-portfolio-blue">Questions</span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">What type of opportunities am I looking for?</h3>
                  <p className="text-sm text-muted-foreground">
                    I'm actively seeking internship opportunities in full-stack development, 
                    IoT solutions, backend engineering, and innovative tech projects. 
                    Both full-time and part-time positions are welcome.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">What technologies do I specialize in?</h3>
                  <p className="text-sm text-muted-foreground">
                    I have strong expertise in JavaScript, Node.js, React, IoT development with ESP32, 
                    database management with MySQL, and cloud deployment with Docker. 
                    I'm always eager to learn new technologies.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Can I work remotely?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes! I'm experienced with remote collaboration and have worked on distributed teams. 
                    I'm also open to hybrid or on-site opportunities in the Jakarta area.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">How quickly can I start?</h3>
                  <p className="text-sm text-muted-foreground">
                    I'm currently available and can start immediately for the right opportunity. 
                    My academic schedule is flexible, allowing for full-time internships 
                    during semester breaks and part-time during studies.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
