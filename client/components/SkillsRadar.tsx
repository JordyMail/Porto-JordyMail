import { useRef, useEffect } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { Badge } from '@/components/ui/badge';

interface SkillCategory {
  name: string;
  color: string;
  skills: { name: string; level: number }[];
}

export default function SkillsRadar() {
  const { data } = usePortfolio();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const skillCategories: SkillCategory[] = [
    {
      name: 'Frontend',
      color: '#3B82F6',
      skills: data.skills.filter(s => s.category === 'frontend').map(s => ({ name: s.name, level: s.level }))
    },
    {
      name: 'Backend',
      color: '#8B5CF6',
      skills: data.skills.filter(s => s.category === 'backend').map(s => ({ name: s.name, level: s.level }))
    },
    {
      name: 'DevOps',
      color: '#06B6D4',
      skills: data.skills.filter(s => s.category === 'devops').map(s => ({ name: s.name, level: s.level }))
    },
    {
      name: 'Design',
      color: '#F59E0B',
      skills: data.skills.filter(s => s.category === 'design').map(s => ({ name: s.name, level: s.level }))
    },
    {
      name: 'Mobile',
      color: '#EF4444',
      skills: data.skills.filter(s => s.category === 'mobile').map(s => ({ name: s.name, level: s.level }))
    },
    {
      name: 'Other',
      color: '#10B981',
      skills: data.skills.filter(s => s.category === 'other').map(s => ({ name: s.name, level: s.level }))
    }
  ].filter(category => category.skills.length > 0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 60;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw radar grid
    const levels = 5;
    for (let i = 1; i <= levels; i++) {
      const levelRadius = (radius / levels) * i;
      ctx.beginPath();
      ctx.arc(centerX, centerY, levelRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw axes
    const numAxes = skillCategories.length;
    const angleStep = (Math.PI * 2) / numAxes;

    skillCategories.forEach((category, index) => {
      const angle = angleStep * index - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Draw axis line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw category label
      ctx.fillStyle = category.color;
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const labelX = centerX + (radius + 30) * Math.cos(angle);
      const labelY = centerY + (radius + 30) * Math.sin(angle);
      ctx.fillText(category.name, labelX, labelY);

      // Calculate average skill level for this category
      const avgLevel = category.skills.reduce((sum, skill) => sum + skill.level, 0) / category.skills.length;
      const skillRadius = (radius / 10) * avgLevel;

      // Store for drawing the polygon
      const skillX = centerX + skillRadius * Math.cos(angle);
      const skillY = centerY + skillRadius * Math.sin(angle);

      if (index === 0) {
        ctx.beginPath();
        ctx.moveTo(skillX, skillY);
      } else {
        ctx.lineTo(skillX, skillY);
      }

      // Draw skill level point
      ctx.beginPath();
      ctx.arc(skillX, skillY, 4, 0, Math.PI * 2);
      ctx.fillStyle = category.color;
      ctx.fill();
    });

    // Close and fill the skill polygon
    ctx.closePath();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

  }, [data.skills]);

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="max-w-full h-auto"
        />
      </div>

      {/* Skills breakdown */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((category) => (
          <div key={category.name} className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: category.color }}
              />
              {category.name}
            </h4>
            <div className="space-y-2">
              {category.skills.map((skill) => (
                <div key={skill.name} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-accent rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${skill.level * 10}%`,
                          backgroundColor: category.color 
                        }}
                      />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {skill.level}/10
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
