export interface PersonalInfo {
  name: string;
  title: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  location: string;
  summary: string;
  avatar?: string;
  cvDownloadLink?: string;
  customEmailLink?: string;
}

export interface Skill {
  id: string;
  name: string;
  projectCount: number; // Number of projects using this skill
  category: 'frontend' | 'backend' | 'mobile' | 'devops' | 'design' | 'other';
}

export interface Project {
  id: string;
  title: string;
  role: string;
  organization: string;
  duration: string;
  description: string;
  technologies: string[];
  achievements: string[];
  link?: string;
  github?: string;
  images?: string[]; // Support for multiple images (1-5)
  featured?: boolean;
}

export interface Experience {
  id: string;
  title: string;
  organization: string;
  duration: string;
  description: string;
  responsibilities: string[];
  type: 'event' | 'organization' | 'work';
  image?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  duration: string;
  gpa?: string;
  honors?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  organization: string;
  category: string;
}

export interface Language {
  id: string;
  name: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'native';
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  education: Education[];
  achievements: Achievement[];
  languages: Language[];
}

// Utility function to calculate project count for a skill
export const calculateProjectCountForSkill = (skillName: string, projects: Project[]): number => {
  return projects.filter(project =>
    project.technologies.some(tech =>
      tech.toLowerCase().includes(skillName.toLowerCase()) ||
      skillName.toLowerCase().includes(tech.toLowerCase())
    )
  ).length;
};

// Utility function to update skill project counts
export const updateSkillProjectCounts = (skills: Skill[], projects: Project[]): Skill[] => {
  return skills.map(skill => ({
    ...skill,
    projectCount: calculateProjectCountForSkill(skill.name, projects)
  }));
};

// Initial data based on Jordy's CV
export const initialPortfolioData: PortfolioData = {
  personalInfo: {
    name: "Jordy Kastello Mail",
    title: "Ambitious Informatics Student & Full-Stack Developer",
    phone: "+6282146747181",
    email: "jordykastellomail@gmail.com",
    linkedin: "linkedin.com/in/jordymail",
    github: "github.com/JordyMail",
    location: "Bekasi, West Java",
    summary: "Ambitious second-year Informatics student specializing in scalable software applications, IoT solutions, and real-time systems. Enjoys building intuitive and meaningful technology solutions to tackle real-world challenges. Proud winner of a university-level application development competition. Seeking internship opportunities in roles that utilize my skills in fullstack development, IoT, and system design to build user-focused digital experiences."
  },
  skills: [
    { id: "1", name: "JavaScript", projectCount: 4, category: "frontend" },
    { id: "2", name: "Node.js", projectCount: 3, category: "backend" },
    { id: "3", name: "HTML", projectCount: 3, category: "frontend" },
    { id: "4", name: "MySQL", projectCount: 2, category: "backend" },
    { id: "5", name: "Git & Github", projectCount: 7, category: "devops" },
    { id: "6", name: "Tailwind", projectCount: 1, category: "frontend" },
    { id: "7", name: "Python", projectCount: 1, category: "backend" },
    { id: "8", name: "C++", projectCount: 1, category: "other" },
    { id: "9", name: "UI/UX", projectCount: 2, category: "design" },
    { id: "10", name: "Socket.io", projectCount: 2, category: "backend" },
    { id: "11", name: "Figma", projectCount: 1, category: "design" },
    { id: "12", name: "Docker", projectCount: 3, category: "devops" }
  ],
  projects: [
    {
      id: "1",
      title: "Undercoverles – Multiplayer Educational Game",
      role: "Backend Engineer",
      organization: "Client Project, Faculty of Medicine",
      duration: "June – Aug 2025",
      description: "Architected and deployed a real-time multiplayer game server designed for medical education, supporting up to 10 concurrent players per session.",
      technologies: ["Node.js", "Socket.io", "Docker"],
      achievements: [
        "Real-time multiplayer support for 10+ concurrent players",
        "Interactive browser-based learning platform",
        "Scalable backend architecture for educational gaming"
      ],
      featured: true
    },
    {
      id: "2",
      title: "Air Quality Monitoring, Smoking & Fire Detection System",
      role: "Fullstack & IoT Developer",
      organization: "LAPIS AI – Jakarta",
      duration: "Mar – May 2025",
      description: "Created a Laravel web dashboard to monitor indoor air conditions in real-time with automatic alerts for fire risk and smoking detection.",
      technologies: ["Laravel", "ESP32", "MQTT", "IoT"],
      achievements: [
        "Real-time air quality monitoring for 700×320 cm area",
        "Automatic fire and smoking detection alerts",
        "MQTT protocol integration for IoT connectivity"
      ],
      featured: true
    },
    {
      id: "3",
      title: "Autonomous Car Robot",
      role: "Programmer",
      organization: "Personal Project",
      duration: "Mar – May 2025",
      description: "Developed an autonomous robotic car with environmental sensing and decision-making capabilities.",
      technologies: ["C++", "A* Algorithm", "Robotics"],
      achievements: [
        "85% accuracy in path recognition",
        "A-star based path planning optimization",
        "Obstacle detection and hazard avoidance",
        "Rule-based AI behavior simulation"
      ]
    },
    {
      id: "4",
      title: "MQTT Chrome Extension",
      role: "Developer",
      organization: "Personal Project",
      duration: "Mar – Apr 2025",
      description: "Designed and published a Chrome extension for Windows users to streamline IoT data transfers.",
      technologies: ["JavaScript", "Chrome Extensions", "MQTT"],
      achievements: [
        "Support for 50-100 simultaneous MQTT topics",
        "Enhanced developer productivity for IoT workflows",
        "Direct browser to MQTT broker communication"
      ]
    },
    {
      id: "5",
      title: "Inventory Management System – Android Application",
      role: "Fullstack Developer",
      organization: "Personal Project",
      duration: "Jan – Apr 2025",
      description: "Designed and implemented a robust Android app to manage retail inventory transactions.",
      technologies: ["Java", "SQLite", "Android"],
      achievements: [
        "Management of thousands of products efficiently",
        "Offline support functionality",
        "Lightweight SQLite backend"
      ]
    },
    {
      id: "6",
      title: "First Aid – AI-Powered Health Chatbot",
      role: "Machine Learning Engineer",
      organization: "Personal Project",
      duration: "Nov – Dec 2024",
      description: "Developed an Android chatbot app that interprets user-reported symptoms and suggests first aid measures.",
      technologies: ["Android", "NLP", "Machine Learning"],
      achievements: [
        "90% accuracy in symptom-to-recommendation matching",
        "NLP-driven conversational experience",
        "Actionable first aid advice generation"
      ]
    },
    {
      id: "7",
      title: "PUNTEN – Food Delivery Platform",
      role: "Team Lead & Backend Developer",
      organization: "President University",
      duration: "Oct – Nov 2024",
      description: "Led the development of a campus-wide food delivery web platform to address long queues at campus canteen.",
      technologies: ["PHP", "Laravel", "MySQL"],
      achievements: [
        "Winner of 1st Place at Economic Survival Competition",
        "Efficient order management system",
        "Campus-wide vendor and student platform"
      ],
      featured: true
    }
  ],
  experiences: [
    {
      id: "1",
      title: "Project Manager",
      organization: "Reformed Evangelical Student Center (RESC) Anniversary",
      duration: "May – July 2025",
      description: "Lead and coordinated a team of 41 organizing members across multiple divisions.",
      responsibilities: [
        "Designed work timeline and task delegation",
        "Coordinated large-scale event for external organization",
        "Ensured all objectives achieved on time"
      ],
      type: "event"
    },
    {
      id: "2",
      title: "Event Organizer",
      organization: "National Reformed Evangelical Teen Convention (NRETC)",
      duration: "Apr – July 2025",
      description: "Core team member organizing international youth convention with 1,600 participants.",
      responsibilities: [
        "Coordinated entire event sequence from opening to closing",
        "Managed international participants logistics",
        "Maintained high-quality convention standards"
      ],
      type: "event"
    },
    {
      id: "3",
      title: "Liaison Officer",
      organization: "FPCI Chapter, President University",
      duration: "June – Aug 2024",
      description: "Conducted research and communication with speakers for organizational events.",
      responsibilities: [
        "Identified and selected relevant speakers",
        "Professional communication with external speakers",
        "Strengthened organization's external network"
      ],
      type: "organization"
    }
  ],
  education: [
    {
      id: "1",
      institution: "President University",
      degree: "Bachelor of Computer Science",
      field: "Informatics",
      duration: "Sept 2023 - Present",
      gpa: "3.73",
      honors: ["Jababeka Scholarship Awardee"]
    }
  ],
  achievements: [
    {
      id: "1",
      title: "PUNTEN Food Delivery Platform - 1st Place Winner",
      description: "Led development of campus-wide food delivery platform",
      date: "Oct - Nov 2024",
      organization: "President University",
      category: "Competition"
    }
  ],
  languages: [
    { id: "1", name: "Bahasa Indonesia", level: "native" },
    { id: "2", name: "English", level: "intermediate" },
    { id: "3", name: "Japanese", level: "basic" }
  ]
};
