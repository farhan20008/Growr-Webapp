import { useState } from 'react';
import { ScanLine, Camera } from 'lucide-react';
import BarcodeScannerTab from '@/components/scan/BarcodeScannerTab';
import MealPhotoTab from '@/components/scan/MealPhotoTab';

type TabType = 'barcode' | 'photo';

export default function ScanPage() {
  const [activeTab, setActiveTab] = useState<TabType>('barcode');

  return (
    <div className="px-5 pt-12 pb-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Scan</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Scan barcode or snap a meal photo</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex rounded-xl bg-secondary p-1 gap-1">
        <button
          onClick={() => setActiveTab('barcode')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
            activeTab === 'barcode'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ScanLine className="h-4 w-4" />
          Barcode
        </button>
        <button
          onClick={() => setActiveTab('photo')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
            activeTab === 'photo'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Camera className="h-4 w-4" />
          Meal Photo
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'barcode' ? <BarcodeScannerTab /> : <MealPhotoTab />}
    </div>
  );
}
