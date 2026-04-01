import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Flame, Dumbbell, Droplets, Target, Beef, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ONBOARDING_KEY = 'growr-onboarded';

const slides = [
  {
    icon: Flame,
    emoji: '🔥',
    title: 'Track your calories',
    subtitle: 'Log everyday desi meals — eggs, rice, dal, chicken — and stay on target.',
    color: 'bg-warning/15 text-warning',
  },
  {
    icon: Beef,
    emoji: '💪',
    title: 'Hit your protein goal',
    subtitle: 'Build muscle on a budget. Soy chunks, dal, eggs — every gram counts.',
    color: 'bg-success/15 text-success',
  },
  {
    icon: Dumbbell,
    emoji: '🏋️',
    title: 'Follow your workout',
    subtitle: 'A simple 5-day split you can do at any local gym. Track sets & progress.',
    color: 'bg-primary/15 text-primary',
  },
  {
    icon: Droplets,
    emoji: '💧',
    title: 'Stay hydrated',
    subtitle: 'One-tap water logging. Simple reminders to drink throughout the day.',
    color: 'bg-info/15 text-info',
  },
  {
    icon: Target,
    emoji: '🎯',
    title: 'You're ready to grow',
    subtitle: 'No fancy supplements. No expensive diet. Just discipline, consistency, and real food.',
    color: 'bg-primary/15 text-primary',
    isFinal: true,
  },
];

export function hasCompletedOnboarding(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
}

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const slide = slides[current];
  const isLast = current === slides.length - 1;

  const complete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    navigate('/', { replace: true });
  };

  const next = () => {
    if (isLast) {
      complete();
    } else {
      setCurrent(prev => prev + 1);
    }
  };

  const skip = () => complete();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      {/* Skip */}
      {!isLast && (
        <div className="flex justify-end px-5 pt-6">
          <button onClick={skip} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Skip
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div
          key={current}
          className="animate-fade-in flex flex-col items-center"
        >
          {/* Icon */}
          <div className={`flex h-24 w-24 items-center justify-center rounded-3xl ${slide.color} mb-8 shadow-lg`}>
            <span className="text-5xl">{slide.emoji}</span>
          </div>

          {/* Text */}
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-foreground mb-3 max-w-xs">
            {slide.title}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
            {slide.subtitle}
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="px-8 pb-10 pt-4 space-y-5">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-7 bg-primary' : 'w-2 bg-border'
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        {isLast ? (
          <Button
            onClick={complete}
            className="w-full h-14 rounded-2xl text-base font-semibold gap-2 shadow-primary"
            size="lg"
          >
            Let's start growing
            <ArrowRight className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            onClick={next}
            className="w-full h-14 rounded-2xl text-base font-semibold gap-2"
            size="lg"
          >
            Continue
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
