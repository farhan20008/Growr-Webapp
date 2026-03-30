import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Plus, Check, Star, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/hooks/useAppStore';
import { MealEntry } from '@/data/mockData';
import { toast } from 'sonner';

const mealTypes = ['breakfast', 'lunch', 'snacks', 'dinner'] as const;
const mealEmojis = { breakfast: '🌅', lunch: '☀️', snacks: '🍌', dinner: '🌙' };

interface NutritionResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  healthScore: number;
  healthNote: string;
  items: string[];
  serving: string;
}

type AnalyzeState = 'idle' | 'loading' | 'result';

export default function MealPhotoTab() {
  const { addMeal } = useAppStore();
  const [analyzeState, setAnalyzeState] = useState<AnalyzeState>('idle');
  const [result, setResult] = useState<NutritionResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<typeof mealTypes[number]>('lunch');
  const [added, setAdded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const analyzeImage = async (file: File) => {
    setAnalyzeState('loading');
    setResult(null);
    setAdded(false);

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);

    // Convert to base64
    const base64 = await new Promise<string>((resolve) => {
      const r = new FileReader();
      r.onload = () => {
        const result = r.result as string;
        resolve(result.split(',')[1]); // strip data:... prefix
      };
      r.readAsDataURL(file);
    });

    try {
      const { data, error } = await supabase.functions.invoke('analyze-meal', {
        body: { imageBase64: base64 },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data as NutritionResult);
      setAnalyzeState('result');
    } catch (err: any) {
      console.error('Analysis error:', err);
      toast.error(err?.message || 'Failed to analyze meal. Please try again.');
      setAnalyzeState('idle');
      setPreviewUrl(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) analyzeImage(file);
    e.target.value = '';
  };

  const handleAddToMeal = () => {
    if (!result) return;
    const entry: MealEntry = {
      id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      foodId: `photo-${Date.now()}`,
      foodName: result.name,
      calories: result.calories,
      protein: result.protein,
      quantity: 1,
      serving: result.serving,
      mealType: selectedMeal,
      timestamp: new Date().toISOString(),
    };
    addMeal(entry);
    setAdded(true);
    toast.success(`Added ${result.name} to ${selectedMeal}`);
  };

  const handleReset = () => {
    setAnalyzeState('idle');
    setResult(null);
    setPreviewUrl(null);
    setAdded(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 5) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-green-500/10';
    if (score >= 5) return 'bg-yellow-500/10';
    return 'bg-red-500/10';
  };

  return (
    <div className="space-y-4">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />

      {analyzeState === 'idle' && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-full rounded-2xl bg-card p-6 shadow-sm text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent mb-3">
              <Camera className="h-8 w-8 text-accent-foreground" />
            </div>
            <h3 className="text-base font-bold font-heading text-foreground mb-1.5">Meal Photo Analysis</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Take a photo or upload one — AI will estimate calories, macros & health score
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors active:scale-95"
              >
                <Camera className="h-4 w-4" />
                Take Photo
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground shadow-sm hover:bg-secondary/80 transition-colors active:scale-95"
              >
                <Upload className="h-4 w-4" />
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {analyzeState === 'loading' && (
        <div className="space-y-3">
          {previewUrl && (
            <div className="w-full rounded-2xl overflow-hidden shadow-sm">
              <img src={previewUrl} alt="Meal" className="w-full h-48 object-cover" />
            </div>
          )}
          <div className="rounded-2xl bg-card p-6 shadow-sm text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">Analyzing your meal…</p>
            <p className="text-xs text-muted-foreground mt-1">AI is estimating nutrition values</p>
          </div>
        </div>
      )}

      {analyzeState === 'result' && result && (
        <div className="space-y-3 animate-scale-in">
          {previewUrl && (
            <div className="w-full rounded-2xl overflow-hidden shadow-sm">
              <img src={previewUrl} alt="Meal" className="w-full h-40 object-cover" />
            </div>
          )}

          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <h3 className="text-base font-bold font-heading text-foreground mb-0.5">{result.name}</h3>
            <p className="text-xs text-muted-foreground mb-3">{result.serving}</p>

            {/* Detected items */}
            {result.items.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {result.items.map((item, i) => (
                  <span key={i} className="text-[11px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            )}

            {/* Macros grid */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="rounded-xl bg-secondary p-2 text-center">
                <p className="text-base font-bold text-foreground">{result.calories}</p>
                <p className="text-[9px] text-muted-foreground font-medium">KCAL</p>
              </div>
              <div className="rounded-xl bg-secondary p-2 text-center">
                <p className="text-base font-bold text-foreground">{result.protein}g</p>
                <p className="text-[9px] text-muted-foreground font-medium">PROTEIN</p>
              </div>
              <div className="rounded-xl bg-secondary p-2 text-center">
                <p className="text-base font-bold text-foreground">{result.carbs}g</p>
                <p className="text-[9px] text-muted-foreground font-medium">CARBS</p>
              </div>
              <div className="rounded-xl bg-secondary p-2 text-center">
                <p className="text-base font-bold text-foreground">{result.fat}g</p>
                <p className="text-[9px] text-muted-foreground font-medium">FAT</p>
              </div>
            </div>

            {/* Health Score */}
            <div className={`rounded-xl ${getScoreBg(result.healthScore)} p-3 flex items-center gap-3 mb-3`}>
              <div className={`flex items-center gap-1 ${getScoreColor(result.healthScore)}`}>
                <Star className="h-5 w-5 fill-current" />
                <span className="text-2xl font-bold">{result.healthScore}</span>
                <span className="text-xs font-medium">/10</span>
              </div>
              <p className="text-xs text-foreground/80 flex-1">{result.healthNote}</p>
            </div>

            {/* Meal type selector */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Add to</p>
              <div className="flex gap-1.5 flex-wrap">
                {mealTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedMeal(type)}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                      selectedMeal === type ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    <span>{mealEmojis[type]}</span>
                    <span className="capitalize">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {!added ? (
              <button onClick={handleAddToMeal} className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors active:scale-95">
                <Plus className="h-4 w-4" /> Add to {selectedMeal}
              </button>
            ) : (
              <div className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-green-500/10 py-2.5 text-sm font-semibold text-green-600">
                <Check className="h-4 w-4" /> Added to {selectedMeal}!
              </div>
            )}
          </div>

          <button onClick={handleReset} className="mx-auto flex items-center gap-2 rounded-xl bg-card px-5 py-2 text-sm font-medium text-muted-foreground shadow-sm hover:text-foreground transition-colors">
            <Camera className="h-4 w-4" /> Analyze another
          </button>
        </div>
      )}
    </div>
  );
}
