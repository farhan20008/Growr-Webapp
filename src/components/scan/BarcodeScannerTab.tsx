import { useState, useRef, useEffect, useCallback } from 'react';
import { ScanLine, Camera, X, Plus, Check, AlertCircle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useAppStore } from '@/hooks/useAppStore';
import { lookupBarcode, BarcodeFood } from '@/data/barcodeDatabase';
import { MealEntry } from '@/data/mockData';

const mealTypes = ['breakfast', 'lunch', 'snacks', 'dinner'] as const;
const mealEmojis = { breakfast: '🌅', lunch: '☀️', snacks: '🍌', dinner: '🌙' };

type ScanState = 'idle' | 'scanning' | 'found' | 'not-found';

export default function BarcodeScannerTab() {
  const { addMeal } = useAppStore();
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [scannedFood, setScannedFood] = useState<BarcodeFood | null>(null);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<typeof mealTypes[number]>('lunch');
  const [added, setAdded] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'barcode-scanner';

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === 2) await scannerRef.current.stop();
      } catch {}
      scannerRef.current = null;
    }
  }, []);

  const startScanner = useCallback(async () => {
    setScanState('scanning');
    setScannedFood(null);
    setScannedBarcode('');
    setAdded(false);
    await stopScanner();
    await new Promise(r => setTimeout(r, 300));

    const el = document.getElementById(scannerContainerId);
    if (!el) return;

    try {
      const scanner = new Html5Qrcode(scannerContainerId);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 120 }, aspectRatio: 1.5 },
        (decodedText) => {
          const food = lookupBarcode(decodedText);
          setScannedBarcode(decodedText);
          if (food) { setScannedFood(food); setScanState('found'); }
          else { setScanState('not-found'); }
          scanner.stop().catch(() => {});
          scannerRef.current = null;
        },
        () => {}
      );
    } catch (err) {
      console.error('Scanner error:', err);
      setScanState('idle');
    }
  }, [stopScanner]);

  useEffect(() => { return () => { stopScanner(); }; }, [stopScanner]);

  const handleAddToMeal = () => {
    if (!scannedFood) return;
    const entry: MealEntry = {
      id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      foodId: scannedFood.id,
      foodName: scannedFood.name,
      calories: scannedFood.calories,
      protein: scannedFood.protein,
      quantity: 1,
      serving: scannedFood.serving,
      mealType: selectedMeal,
      timestamp: new Date().toISOString(),
    };
    addMeal(entry);
    setAdded(true);
  };

  const handleReset = () => {
    setScanState('idle');
    setScannedFood(null);
    setScannedBarcode('');
    setAdded(false);
  };

  return (
    <div className="space-y-4">
      {scanState === 'idle' && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-full rounded-2xl bg-card p-6 shadow-sm text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-3">
              <ScanLine className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-base font-bold font-heading text-foreground mb-1.5">Barcode Scanner</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Point your camera at a packaged food barcode
            </p>
            <button
              onClick={startScanner}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors active:scale-95"
            >
              <Camera className="h-4 w-4" />
              Start Scanning
            </button>
          </div>
        </div>
      )}

      {scanState === 'scanning' && (
        <div className="space-y-3">
          <div className="relative w-full rounded-2xl overflow-hidden bg-black/90 shadow-sm">
            <div id={scannerContainerId} className="w-full min-h-[240px]" />
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[260px] h-[130px] border-2 border-primary/50 rounded-xl" />
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground animate-pulse">Point camera at a barcode…</p>
          <button
            onClick={() => { stopScanner(); setScanState('idle'); }}
            className="mx-auto flex items-center gap-2 rounded-xl bg-card px-5 py-2 text-sm font-medium text-muted-foreground shadow-sm hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" /> Cancel
          </button>
        </div>
      )}

      {scanState === 'found' && scannedFood && (
        <div className="space-y-3 animate-scale-in">
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 shrink-0">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Found</p>
                <h3 className="text-base font-bold font-heading text-foreground">{scannedFood.name}</h3>
                {scannedFood.brand && <p className="text-xs text-muted-foreground">{scannedFood.brand}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="rounded-xl bg-secondary p-2.5 text-center">
                <p className="text-base font-bold text-foreground">{scannedFood.calories}</p>
                <p className="text-[10px] text-muted-foreground font-medium">CALORIES</p>
              </div>
              <div className="rounded-xl bg-secondary p-2.5 text-center">
                <p className="text-base font-bold text-foreground">{scannedFood.protein}g</p>
                <p className="text-[10px] text-muted-foreground font-medium">PROTEIN</p>
              </div>
              <div className="rounded-xl bg-secondary p-2.5 text-center">
                <p className="text-base font-bold text-foreground">{scannedFood.serving}</p>
                <p className="text-[10px] text-muted-foreground font-medium">SERVING</p>
              </div>
            </div>

            <div className="mt-3">
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
            <ScanLine className="h-4 w-4" /> Scan another
          </button>
        </div>
      )}

      {scanState === 'not-found' && (
        <div className="space-y-3 animate-scale-in">
          <div className="rounded-2xl bg-card p-4 shadow-sm text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 mb-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <h3 className="text-base font-bold font-heading text-foreground mb-1">Not Found</h3>
            <p className="text-sm text-muted-foreground">
              Barcode <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">{scannedBarcode}</span> isn't in our database.
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <button onClick={startScanner} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors">
              <ScanLine className="h-4 w-4" /> Try again
            </button>
            <button onClick={handleReset} className="flex items-center gap-2 rounded-xl bg-card px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm hover:text-foreground transition-colors">
              <X className="h-4 w-4" /> Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
