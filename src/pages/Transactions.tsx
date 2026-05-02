import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { Card } from '../components/ui/Card';

export function Transactions() {
  const transactions = useLiveQuery(() => db.transactions.orderBy('createdAt').reverse().toArray());

  if (!transactions) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Transactions</h1>
      
      {transactions.length === 0 ? (
        <Card className="text-center py-10">
          <p className="text-gray-500">No transactions yet.</p>
          <p className="text-sm text-gray-400 mt-1">Start tapping habits on the home screen.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {transactions.map(t => {
            const date = new Date(t.createdAt);
            const isCredit = t.type === 'credit';
            
            return (
              <Card key={t.id} className="p-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900">{t.categoryNameSnapshot}</span>
                  <span className="text-xs text-gray-400">
                    {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className={`font-bold ${isCredit ? 'text-green-600' : 'text-gray-600'}`}>
                    {isCredit ? '+' : '-'}{t.amount}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    Bal: {t.balanceAfter}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
