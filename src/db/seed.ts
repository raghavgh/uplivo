import { db, type Category } from './db';

const defaultCategories = {
  student: [
    { name: 'Study', type: 'credit', amount: 10 },
    { name: 'Exercise', type: 'credit', amount: 8 },
    { name: 'Reading', type: 'credit', amount: 6 },
    { name: 'Early Wake', type: 'credit', amount: 7 },
    { name: 'Doom Scroll', type: 'debit', amount: 8 },
    { name: 'Late Sleep', type: 'debit', amount: 6 },
    { name: 'Skipped Work', type: 'debit', amount: 10 },
  ],
  self_improvement: [
    { name: 'Deep Work', type: 'credit', amount: 10 },
    { name: 'Workout', type: 'credit', amount: 8 },
    { name: 'Reading', type: 'credit', amount: 6 },
    { name: 'Meditation', type: 'credit', amount: 7 },
    { name: 'Doom Scroll', type: 'debit', amount: 8 },
    { name: 'Late Sleep', type: 'debit', amount: 6 },
    { name: 'Junk Food', type: 'debit', amount: 8 },
  ],
  general: [
    { name: 'Productive Task', type: 'credit', amount: 10 },
    { name: 'Exercise', type: 'credit', amount: 8 },
    { name: 'Chores', type: 'credit', amount: 6 },
    { name: 'Doom Scroll', type: 'debit', amount: 8 },
    { name: 'Late Sleep', type: 'debit', amount: 6 },
    { name: 'Wasted Time', type: 'debit', amount: 10 },
  ]
} as const;

export async function initializeDefaultCategories(mode: keyof typeof defaultCategories) {
  const categories = defaultCategories[mode];
  const toInsert: Category[] = categories.map(cat => ({
    id: crypto.randomUUID(),
    name: cat.name,
    type: cat.type as 'credit' | 'debit',
    amount: cat.amount,
    createdAt: Date.now(),
    isDefault: true,
    isActive: true
  }));

  await db.categories.bulkAdd(toInsert);
}
