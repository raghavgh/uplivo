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

  const categories = useLiveQuery(() => db.categories.filter(c => c.isActive).toArray());
  const transactions = useLiveQuery(() => db.transactions.orderBy('createdAt').reverse().toArray());

  const currentBalance = transactions?.length ? transactions[0].balanceAfter : 0;
  
  const credits = categories?.filter(c => c.type === 'credit') || [];
  const debits = categories?.filter(c => c.type === 'debit') || [];

  const handleAction = async (category: Category) => {
    const isCredit = category.type === 'credit';
    const newBalance = isCredit ? currentBalance + category.amount : currentBalance - category.amount;
    const msgText = getRandomMessage(category.type);

    await db.transactions.add({
      id: crypto.randomUUID(),
      categoryId: category.id,
      categoryNameSnapshot: category.name,
      type: category.type,
      amount: category.amount,
      balanceAfter: newBalance,
      createdAt: Date.now(),
      messageShown: msgText
    });

    setMessage({ text: msgText, type: category.type });
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
            {credits.map(cat => (
              <Button 
                key={cat.id} 
                variant="secondary"
                className="h-auto py-3 px-4 justify-between bg-green-50 border border-green-100 hover:bg-green-100"
                onClick={() => handleAction(cat)}
              >
                <span className="truncate mr-2 font-medium">{cat.name}</span>
                <span className="text-green-600 font-bold">+{cat.amount}</span>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Bad Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {debits.map(cat => (
              <Button 
                key={cat.id} 
                variant="outline"
                className="h-auto py-3 px-4 justify-between border-gray-200 hover:bg-red-50 hover:border-red-100 hover:text-red-700"
                onClick={() => handleAction(cat)}
              >
                <span className="truncate mr-2 font-medium">{cat.name}</span>
                <span className="text-gray-500 font-bold group-hover:text-red-500">-{cat.amount}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
