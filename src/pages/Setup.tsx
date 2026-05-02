import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeDefaultCategories } from '../db/seed';
import { db } from '../db/db';
import { Card } from '../components/ui/Card';

type Mode = 'student' | 'self_improvement' | 'general';

export function Setup() {
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(false);

  const handleSelectMode = async (mode: Mode) => {
    setIsInitializing(true);
    try {
      // Clear existing data for fresh setup
      await db.categories.clear();
      await db.transactions.clear();
      await db.settings.clear();

      await initializeDefaultCategories(mode);
      
      await db.settings.put({
        id: 1,
        onboardingComplete: true,
        selectedMode: mode,
        appVersion: '1.0.0'
      });

      navigate('/home');
    } catch (error) {
      console.error('Setup failed:', error);
      setIsInitializing(false);
    }
  };

  return (
    <div className="flex flex-col h-full px-2">
      <div className="mt-8 mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose your focus</h1>
        <p className="text-gray-500">This sets up your default habits.</p>
      </div>

      <div className="space-y-4">
        <ModeOption 
          title="Student Mode" 
          description="Focus on studying, limiting scroll time, and staying consistent."
          onClick={() => handleSelectMode('student')}
          disabled={isInitializing}
        />
        <ModeOption 
          title="Self Improvement" 
          description="Focus on deep work, meditation, reading, and fitness."
          onClick={() => handleSelectMode('self_improvement')}
          disabled={isInitializing}
        />
        <ModeOption 
          title="General Balance" 
          description="A simple setup for everyday productive choices."
          onClick={() => handleSelectMode('general')}
          disabled={isInitializing}
        />
      </div>
    </div>
  );
}

function ModeOption({ title, description, onClick, disabled }: { title: string, description: string, onClick: () => void, disabled: boolean }) {
  return (
    <Card 
      className="cursor-pointer hover:border-green-300 transition-colors hover:shadow-md active:scale-[0.98]"
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </Card>
  );
}
