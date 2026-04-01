import { User, Target, Wallet, Dumbbell, Droplets, Utensils, Moon, Bell, ChevronRight } from 'lucide-react';
import { userProfile } from '@/data/mockData';
import { getOnboardingProfile } from '@/pages/OnboardingPage';

const onboarding = getOnboardingProfile();
const profile = {
  ...userProfile,
  ...(onboarding ? {
    name: onboarding.name,
    currentWeight: onboarding.currentWeight,
    calorieGoal: onboarding.calorieGoal,
  } : {}),
};

const settingsSections = [
  {
    title: 'Goals',
    items: [
      { icon: Target, label: 'Daily Calorie Goal', value: `${profile.calorieGoal} cal` },
      { icon: Target, label: 'Daily Protein Goal', value: `${profile.proteinGoal}g` },
      { icon: Droplets, label: 'Daily Water Goal', value: `${profile.waterGoal / 1000}L` },
      { icon: Target, label: 'Goal Weight', value: `${profile.goalWeight}kg` },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Wallet, label: 'Budget Mode', value: 'On' },
      { icon: Dumbbell, label: 'Workout Days', value: `${userProfile.workoutDays} days/week` },
      { icon: Utensils, label: 'Food Preferences', value: 'Local foods' },
    ],
  },
  {
    title: 'App',
    items: [
      { icon: Moon, label: 'Theme', value: 'Light' },
      { icon: Bell, label: 'Notifications', value: 'Coming soon' },
    ],
  },
];

export default function ProfilePage() {
  return (
    <div className="px-5 pt-12 pb-6 space-y-6 animate-fade-in">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-heading text-foreground">{profile.name}</h1>
          <p className="text-sm text-muted-foreground">{profile.currentWeight}kg · Lean bulk</p>
        </div>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Current', value: `${profile.currentWeight}kg` },
          { label: 'Goal', value: `${profile.goalWeight}kg` },
          { label: 'To go', value: `+${(profile.goalWeight - profile.currentWeight).toFixed(1)}kg` },
        ].map(s => (
          <div key={s.label} className="rounded-2xl bg-card p-3 shadow-sm text-center">
            <p className="text-lg font-bold font-heading text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Settings */}
      {settingsSections.map(section => (
        <div key={section.title}>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">{section.title}</h3>
          <div className="rounded-2xl bg-card shadow-sm overflow-hidden divide-y divide-border">
            {section.items.map(item => (
              <button key={item.label} className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{item.value}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
