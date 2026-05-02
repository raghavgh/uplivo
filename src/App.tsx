import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db/db';

import { AppLayout } from './components/layout/AppLayout';
import { Welcome } from './pages/Welcome';
import { Setup } from './pages/Setup';
import { Home } from './pages/Home';
import { Transactions } from './pages/Transactions';
import { Settings } from './pages/Settings';
import { Categories } from './pages/Categories';

export default function App() {
  const settings = useLiveQuery(() => db.settings.get(1));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay to allow db to be queried on mount before redirecting
    const timer = setTimeout(() => setIsLoading(false), 50);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <div className="min-h-screen bg-gray-50" />;

  const hasCompletedOnboarding = settings?.onboardingComplete;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route 
            index 
            element={hasCompletedOnboarding ? <Navigate to="/home" replace /> : <Welcome />} 
          />
          <Route path="setup" element={<Setup />} />
          
          <Route path="home" element={<Home />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="settings" element={<Settings />} />
          <Route path="categories" element={<Categories />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
