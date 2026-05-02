import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, List, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export function AppLayout() {
  const location = useLocation();
  const hideNavPaths = ['/', '/setup']; // Don't show bottom nav on welcome or setup
  const showNav = !hideNavPaths.includes(location.pathname);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-gray-50 pb-20 relative shadow-2xl sm:shadow-none sm:border-x sm:border-gray-100">
      <main className="flex-1 overflow-y-auto px-4 pt-6 pb-24">
        <Outlet />
      </main>

      {showNav && (
        <nav className="fixed bottom-0 z-50 w-full max-w-md border-t border-gray-100 bg-white/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-around px-6">
            <NavItem to="/home" icon={<Home />} label="Home" />
            <NavItem to="/transactions" icon={<List />} label="Transactions" />
            <NavItem to="/settings" icon={<SettingsIcon />} label="Settings" />
          </div>
        </nav>
      )}
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex flex-col items-center justify-center gap-1 text-sm font-medium transition-colors',
          isActive ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
        )
      }
    >
      <div className="[&>svg]:w-6 [&>svg]:h-6">{icon}</div>
      <span className="text-[10px]">{label}</span>
    </NavLink>
  );
}
