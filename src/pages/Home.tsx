import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Category } from '../db/db';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const POSITIVE_MESSAGES = [
  "Nice move.", "Balance growing.", "Good step.", 
  "Keep going.", "Strong choice.", "You're improving.", "Small wins matter."
];

const NEGATIVE_MESSAGES = [
  "Logged honestly. Next step matters.", "It happens. Recover now.", 
  "One choice doesn't define today.", "You've bounced back before.", 
  "Reset with one good action.", "Stay steady.", "Progress continues."
];

function getRandomMessage(type: 'credit' | 'debit') {
  const list = type === 'credit' ? POSITIVE_MESSAGES : NEGATIVE_MESSAGES;
  return list[Math.floor(Math.random() * list.length)];
}

export function Home() {
  const [message, setMessage] = useState<{text: string, type: 'credit' | 'debit'} | null>(null);
  const [multipliers, setMultipliers] = useState<Record<string, string>>({});

  const categories = useLiveQuery(() => db.categories.filter(c => c.isActive).toArray());
  const transactions = useLiveQuery(() => db.transactions.orderBy('createdAt').reverse().toArray());

  const currentBalance = transactions?.length ? transactions[0].balanceAfter : 0;
  
  const credits = categories?.filter(c => c.type === 'credit') || [];
  const debits = categories?.filter(c => c.type === 'debit') || [];

  const getMultiplier = (id: string) => {
    const val = multipliers[id];
    return val ? Math.max(1, parseInt(val) || 1) : 1;
  };

  const handleMultiplierChange = (id: string, value: string) => {
    setMultipliers(prev => ({ ...prev, [id]: value }));
  };

  const handleAction = async (category: Category) => {
    const m = getMultiplier(category.id);
    const isCredit = category.type === 'credit';
    const totalAmount = category.amount * m;
    const newBalance = isCredit ? currentBalance + totalAmount : currentBalance - totalAmount;
    const msgText = getRandomMessage(category.type);
    const actionName = m > 1 ? `${category.name} (x${m})` : category.name;

    await db.transactions.add({
      id: crypto.randomUUID(),
      categoryId: category.id,
      categoryNameSnapshot: actionName,
      type: category.type,
      amount: totalAmount,
      balanceAfter: newBalance,
      createdAt: Date.now(),
      messageShown: msgText
    });

    setMessage({ text: msgText, type: category.type });
    setMultipliers(prev => {
      const next = { ...prev };
      delete next[category.id];
      return next;
    });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 py-8 flex flex-col items-center justify-center shadow-lg">
        <p className="text-green-100 font-medium mb-1">Net Balance</p>
        <h1 className="text-6xl font-bold tracking-tight">
          {currentBalance > 0 ? '+' : ''}{currentBalance}
        </h1>
      </Card>

      {/* Motivational Message Area */}
      <div className="h-8 flex items-center justify-center">
        {message && (
          <p className={`text-sm font-medium px-4 py-1.5 rounded-full ${
            message.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
          }`}>
            {message.text}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Good Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {credits.map(cat => {
              const m = getMultiplier(cat.id);
              const mString = multipliers[cat.id] ?? '';
              return (
                <div key={cat.id} className="flex bg-green-50 border border-green-100 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-green-500">
                  <input 
                    type="number" 
                    min="1"
                    value={mString}
                    onChange={(e) => handleMultiplierChange(cat.id, e.target.value)}
                    placeholder="1"
                    className="w-10 text-center bg-white/60 border-r border-green-100 font-semibold text-sm text-gray-700 outline-none"
                  />
                  <button 
                    className="flex-1 py-3 px-2 flex justify-between items-center hover:bg-green-100 transition-colors active:bg-green-200"
                    onClick={() => handleAction(cat)}
                  >
                    <span className="truncate mr-1 font-medium text-sm text-gray-900">{cat.name}</span>
                    <span className="text-green-600 font-bold text-sm">+{cat.amount * m}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Bad Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {debits.map(cat => {
              const m = getMultiplier(cat.id);
              const mString = multipliers[cat.id] ?? '';
              return (
                <div key={cat.id} className="flex border border-gray-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-red-500 group">
                  <input 
                    type="number" 
                    min="1"
                    value={mString}
                    onChange={(e) => handleMultiplierChange(cat.id, e.target.value)}
                    placeholder="1"
                    className="w-10 text-center bg-gray-50 border-r border-gray-200 font-semibold text-sm text-gray-700 outline-none group-hover:bg-red-50 group-hover:border-red-100 transition-colors"
                  />
                  <button 
                    className="flex-1 py-3 px-2 flex justify-between items-center hover:bg-red-50 transition-colors active:bg-red-100"
                    onClick={() => handleAction(cat)}
                  >
                    <span className="truncate mr-1 font-medium text-sm text-gray-900">{cat.name}</span>
                    <span className="text-gray-500 font-bold text-sm group-hover:text-red-500 transition-colors">-{cat.amount * m}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
