import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center text-center">
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold tracking-tight text-green-600 mb-4">Uplivo</h1>
        <p className="text-xl text-gray-500 font-medium">Tap good habits.<br />Grow daily.</p>
      </div>
      
      <div className="w-full px-6">
        <Button size="lg" className="w-full text-lg" onClick={() => navigate('/setup')}>
          Start Now
        </Button>
      </div>
    </div>
  );
}
