import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Flame, Dumbbell, Droplets, Target, Beef, ArrowRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ONBOARDING_KEY = 'growr-onboarded';
const PROFILE_KEY = 'growr-profile';

interface SlideData {
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  isForm?: boolean;
  isFinal?: boolean;
}

const slides: SlideData[] = [
  {
    emoji: '🔥',
    title: 'Track your calories',
    subtitle: 'Log everyday desi meals — eggs, rice, dal, chicken — and stay on target.',
    color: 'bg-warning/15 text-warning',
  },
  {
    emoji: '💪',
    title: 'Hit your protein goal',
    subtitle: 'Build muscle on a budget. Soy chunks, dal, eggs — every gram counts.',
    color: 'bg-success/15 text-success',
  },
  {
    emoji: '🏋️',
    title: 'Follow your workout',
    subtitle: 'A simple 5-day split you can do at any local gym. Track sets & progress.',
    color: 'bg-primary/15 text-primary',
  },
  {
    emoji: '💧',
    title: 'Stay hydrated',
    subtitle: 'One-tap water logging. Simple reminders to drink throughout the day.',
    color: 'bg-info/15 text-info',
  },
  {
    emoji: '👤',
    title: 'Set up your profile',
    subtitle: 'Tell us a bit about yourself so we can personalize your goals.',
    color: 'bg-accent text-accent-foreground',
    isForm: true,
  },
  {
    emoji: '🎯',
    title: "You're ready to grow",
    subtitle: 'No fancy supplements. No expensive diet. Just discipline, consistency, and real food.',
    color: 'bg-primary/15 text-primary',
    isFinal: true,
  },
];

export function hasCompletedOnboarding(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
}

export function getOnboardingProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [calorieGoal, setCalorieGoal] = useState('');
  const navigate = useNavigate();
  const slide = slides[current];
  const isLast = current === slides.length - 1;
  const isForm = slide.isForm;

  const formValid = name.trim().length > 0 && Number(weight) > 0 && Number(calorieGoal) > 0;

  const complete = () => {
    const profile = {
      name: name.trim() || 'User',
      currentWeight: Number(weight) || 68,
      calorieGoal: Number(calorieGoal) || 2400,
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
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
        <div key={current} className="animate-fade-in flex flex-col items-center w-full max-w-sm">
          {/* Icon */}
          <div className={`flex h-24 w-24 items-center justify-center rounded-3xl ${slide.color} mb-8 shadow-lg`}>
            <span className="text-5xl">{slide.emoji}</span>
          </div>

          {/* Text */}
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-foreground mb-3 max-w-xs">
            {slide.title}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-sm mb-6">
            {slide.subtitle}
          </p>

          {/* Profile Form */}
          {isForm && (
            <div className="w-full space-y-4 text-left">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Your name</label>
                <Input
                  placeholder="e.g. Rahim"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Current weight (kg)</label>
                <Input
                  type="number"
                  placeholder="e.g. 65"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="h-12 rounded-xl"
                  min={30}
                  max={200}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Daily calorie goal</label>
                <Input
                  type="number"
                  placeholder="e.g. 2400"
                  value={calorieGoal}
                  onChange={e => setCalorieGoal(e.target.value)}
                  className="h-12 rounded-xl"
                  min={1200}
                  max={5000}
                />
              </div>
            </div>
          )}
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
            disabled={isForm && !formValid}
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
