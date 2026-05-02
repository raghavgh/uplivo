import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Category } from '../db/db';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function Categories() {
  const categories = useLiveQuery(() => db.categories.toArray());
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'credit' | 'debit'>('credit');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    await db.categories.add({
      id: crypto.randomUUID(),
      name,
      type,
      amount: parseInt(amount, 10) || 0,
      createdAt: Date.now(),
      isDefault: false,
      isActive: true
    });

    setIsAdding(false);
    setName('');
    setAmount('');
  };

  const toggleActive = async (cat: Category) => {
    await db.categories.update(cat.id, { isActive: !cat.isActive });
  };

  const deleteCategory = async (id: string) => {
    if (window.confirm('Delete this habit permanently?')) {
      await db.categories.delete(id);
    }
  };

  if (!categories) return null;

  const credits = categories.filter(c => c.type === 'credit');
  const debits = categories.filter(c => c.type === 'debit');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Habits</h1>
        <Button size="sm" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : '+ New Habit'}
        </Button>
      </div>

      {isAdding && (
        <Card className="p-4 border-green-200 bg-green-50">
          <form onSubmit={handleAdd} className="flex flex-col gap-3">
            <input 
              type="text" 
              placeholder="Habit name (e.g. Meditate)" 
              className="px-3 py-2 rounded-lg border border-gray-300 w-full"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <div className="flex gap-3">
              <select 
                className="px-3 py-2 rounded-lg border border-gray-300 flex-1 bg-white"
                value={type}
                onChange={e => setType(e.target.value as 'credit'|'debit')}
              >
                <option value="credit">Good (Credit)</option>
                <option value="debit">Bad (Debit)</option>
              </select>
              <input 
                type="number" 
                placeholder="Value" 
                className="px-3 py-2 rounded-lg border border-gray-300 w-24"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                min="1"
              />
            </div>
            <Button type="submit" className="mt-2">Save Habit</Button>
          </form>
        </Card>
      )}

      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Good Habits</h2>
        <div className="space-y-2">
          {credits.map(cat => <CategoryRow key={cat.id} cat={cat} onToggle={() => toggleActive(cat)} onDelete={() => deleteCategory(cat.id)} />)}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Bad Habits</h2>
        <div className="space-y-2">
          {debits.map(cat => <CategoryRow key={cat.id} cat={cat} onToggle={() => toggleActive(cat)} onDelete={() => deleteCategory(cat.id)} />)}
        </div>
      </div>
    </div>
  );
}

function CategoryRow({ cat, onToggle, onDelete }: { cat: Category, onToggle: () => void, onDelete: () => void }) {
  return (
    <Card className={`p-4 flex items-center justify-between ${!cat.isActive ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-3">
        <input 
          type="checkbox" 
          checked={cat.isActive} 
          onChange={onToggle}
          className="w-5 h-5 accent-green-500"
        />
        <span className="font-medium text-gray-900">{cat.name}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className={`font-bold ${cat.type === 'credit' ? 'text-green-600' : 'text-gray-500'}`}>
          {cat.type === 'credit' ? '+' : '-'}{cat.amount}
        </span>
        {!cat.isDefault && (
          <button onClick={onDelete} className="text-red-400 hover:text-red-600 font-bold text-xl leading-none">&times;</button>
        )}
      </div>
    </Card>
  );
}
