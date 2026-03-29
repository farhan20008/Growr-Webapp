import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl pb-20 sm:pb-24">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
