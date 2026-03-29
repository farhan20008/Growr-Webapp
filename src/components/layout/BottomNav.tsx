import { Home, Utensils, Dumbbell, Droplets, TrendingUp, User, ScanLine } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/meals', icon: Utensils, label: 'Meals' },
  { path: '/scan', icon: ScanLine, label: 'Scan', center: true },
  { path: '/workout', icon: Dumbbell, label: 'Workout' },
  { path: '/water', icon: Droplets, label: 'Water' },
  { path: '/progress', icon: TrendingUp, label: 'Progress' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md safe-area-bottom">
      <div className="mx-auto flex max-w-2xl items-center justify-around py-1.5 px-1 sm:py-2">
        {navItems.map(({ path, icon: Icon, label, center }) => {
          const active = location.pathname === path;

          if (center) {
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={cn(
                  'relative -mt-5 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-200',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-primary/90 text-primary-foreground hover:bg-primary'
                )}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          }

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                'flex flex-col items-center gap-0.5 rounded-xl px-1.5 py-1 transition-all duration-200 sm:px-3 sm:py-1.5',
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('h-[18px] w-[18px] sm:h-5 sm:w-5', active && 'stroke-[2.5]')} />
              <span className={cn('text-[9px] sm:text-[10px] font-medium leading-tight', active && 'font-semibold')}>
                {label}
              </span>
              {active && (
                <div className="h-0.5 w-3 sm:w-4 rounded-full bg-primary mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
