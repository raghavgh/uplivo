import { useNavigate } from 'react-router-dom';
import { db } from '../db/db';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function Settings() {
  const navigate = useNavigate();

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
      await db.transactions.clear();
      await db.categories.clear();
      await db.settings.clear();
      navigate('/setup');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="space-y-4">
        <Card className="p-5 cursor-pointer hover:border-green-300 transition-colors" onClick={() => navigate('/categories')}>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Manage Habits</h2>
          <p className="text-sm text-gray-500">
            Add, edit, or delete your good and bad habits.
          </p>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Data & Privacy</h2>
          <p className="text-sm text-gray-500 mb-4">
            All your data is stored locally on your device. We do not track or sync your habits to any server.
          </p>
          
          <Button variant="danger" className="w-full" onClick={handleReset}>
            Reset All Progress
          </Button>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">About Uplivo</h2>
          <p className="text-sm text-gray-500 mb-2">
            Tap good habits. Grow daily.
          </p>
          <p className="text-xs text-gray-400">
            Version 1.0.0
          </p>
        </Card>
      </div>
    </div>
  );
}
