import { useState } from 'react';
import { User, Target, Droplets, Dumbbell, Utensils, Moon, Bell, ChevronRight, Pencil, Check, X } from 'lucide-react';
import { userProfile } from '@/data/mockData';
import { getOnboardingProfile } from '@/pages/OnboardingPage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PROFILE_KEY = 'growr-profile';

function loadProfile() {
  const onboarding = getOnboardingProfile();
  return {
    ...userProfile,
    ...(onboarding ? {
      name: onboarding.name,
      currentWeight: onboarding.currentWeight,
      calorieGoal: onboarding.calorieGoal,
      proteinGoal: onboarding.proteinGoal ?? userProfile.proteinGoal,
    } : {}),
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(loadProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  const startEditing = () => {
    setDraft(profile);
    setEditing(true);
  };

  const cancel = () => setEditing(false);

  const save = () => {
    const updated = {
      name: draft.name.trim() || 'User',
      currentWeight: Number(draft.currentWeight) || profile.currentWeight,
      calorieGoal: Number(draft.calorieGoal) || profile.calorieGoal,
      proteinGoal: Number(draft.proteinGoal) || profile.proteinGoal,
    };
    const newProfile = { ...profile, ...updated };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    setProfile(newProfile);
    setEditing(false);
    toast.success('Profile updated');
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
        { icon: Dumbbell, label: 'Workout Days', value: `${profile.workoutDays} days/week` },
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

  return (
    <div className="px-5 pt-12 pb-6 space-y-6 animate-fade-in">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>
          {editing ? (
            <div>
              <Input
                value={draft.name}
                onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                className="h-10 rounded-xl text-lg font-bold font-heading w-40"
                placeholder="Your name"
              />
            </div>
          ) : (
            <div>
              <h1 className="text-xl font-bold font-heading text-foreground">{profile.name}</h1>
              <p className="text-sm text-muted-foreground">{profile.currentWeight}kg · Lean bulk</p>
            </div>
          )}
        </div>
        {!editing && (
          <button onClick={startEditing} className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary transition-colors hover:bg-secondary/80">
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Editable fields */}
      {editing && (
        <div className="rounded-2xl bg-card p-4 shadow-sm space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Current weight (kg)</label>
            <Input
              type="number"
              value={draft.currentWeight}
              onChange={e => setDraft(d => ({ ...d, currentWeight: e.target.value as any }))}
              className="h-12 rounded-xl"
              min={30}
              max={200}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Daily calorie goal</label>
            <Input
              type="number"
              value={draft.calorieGoal}
              onChange={e => setDraft(d => ({ ...d, calorieGoal: e.target.value as any }))}
              className="h-12 rounded-xl"
              min={1200}
              max={5000}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Daily protein goal (g)</label>
            <Input
              type="number"
              value={draft.proteinGoal}
              onChange={e => setDraft(d => ({ ...d, proteinGoal: e.target.value as any }))}
              className="h-12 rounded-xl"
              min={30}
              max={400}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={save} className="flex-1 h-12 rounded-xl gap-2">
              <Check className="h-4 w-4" /> Save
            </Button>
            <Button onClick={cancel} variant="outline" className="h-12 rounded-xl gap-2 px-6">
              <X className="h-4 w-4" /> Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Current Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Current', value: `${profile.currentWeight}kg` },
          { label: 'Goal', value: `${profile.goalWeight}kg` },
          { label: 'To go', value: `+${(profile.goalWeight - Number(profile.currentWeight)).toFixed(1)}kg` },
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
              <div key={item.label} className="w-full flex items-center justify-between p-4 text-left">
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
