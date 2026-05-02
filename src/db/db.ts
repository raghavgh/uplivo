import Dexie, { type EntityTable } from 'dexie';

export interface Category {
  id: string; // uuid
  name: string;
  type: 'credit' | 'debit';
  amount: number;
  createdAt: number;
  isDefault: boolean;
  isActive: boolean;
}

export interface Transaction {
  id: string; // uuid
  categoryId: string;
  categoryNameSnapshot: string;
  type: 'credit' | 'debit';
  amount: number;
  balanceAfter: number;
  createdAt: number;
  messageShown: string;
}

export interface Settings {
  id: number; // Always 1
  onboardingComplete: boolean;
  selectedMode: 'student' | 'self_improvement' | 'general' | null;
  appVersion: string;
}

const db = new Dexie('UplivoDB') as Dexie & {
  categories: EntityTable<Category, 'id'>;
  transactions: EntityTable<Transaction, 'id'>;
  settings: EntityTable<Settings, 'id'>;
};

db.version(1).stores({
  categories: 'id, type, isActive', 
  transactions: 'id, categoryId, createdAt',
  settings: 'id'
});

export { db };
