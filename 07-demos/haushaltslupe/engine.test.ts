import { describe, it, expect } from 'vitest';

// Define a simplified structure for budget items and a budget
interface BudgetItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  type: 'revenue' | 'expenditure';
}

interface Budget {
  id: string;
  name: string;
  year: number;
  items: BudgetItem[];
}

// Function to compare two budgets and find differences
function compareBudgets(budgetA: Budget, budgetB: Budget): {
  added: BudgetItem[];
  removed: BudgetItem[];
  changed: { itemA: BudgetItem; itemB: BudgetItem; changes: string[] }[];
} {
  const added: BudgetItem[] = [];
  const removed: BudgetItem[] = [];
  const changed: { itemA: BudgetItem; itemB: BudgetItem; changes: string[] }[] = [];

  const budgetAItemsMap = new Map<string, BudgetItem>();
  budgetA.items.forEach(item => budgetAItemsMap.set(item.id, item));

  const budgetBItemsMap = new Map<string, BudgetItem>();
  budgetB.items.forEach(item => budgetBItemsMap.set(item.id, item));

  // Find added and changed items in B compared to A
  for (const itemB of budgetB.items) {
    const itemA = budgetAItemsMap.get(itemB.id);
    if (!itemA) {
      added.push(itemB);
    } else {
      const itemChanges: string[] = [];
      if (itemA.category !== itemB.category) itemChanges.push('category');
      if (itemA.description !== itemB.description) itemChanges.push('description');
      if (itemA.amount !== itemB.amount) itemChanges.push('amount');
      if (itemA.type !== itemB.type) itemChanges.push('type');

      if (itemChanges.length > 0) {
        changed.push({ itemA, itemB, changes: itemChanges });
      }
    }
  }

  // Find removed items from A not in B
  for (const itemA of budgetA.items) {
    if (!budgetBItemsMap.has(itemA.id)) {
      removed.push(itemA);
    }
  }

  return { added, removed, changed };
}

describe('compareBudgets', () => {
  const budgetOriginal: Budget = {
    id: 'b1',
    name: 'Original Budget 2023',
    year: 2023,
    items: [
      { id: '1', category: 'Education', description: 'School supplies', amount: 100000, type: 'expenditure' },
      { id: '2', category: 'Infrastructure', description: 'Road repair', amount: 250000, type: 'expenditure' },
      { id: '3', category: 'Culture', description: 'Museum funding', amount: 50000, type: 'expenditure' },
      { id: '4', category: 'Revenue', description: 'Property taxes', amount: 500000, type: 'revenue' },
    ],
  };

  it('should detect no changes if budgets are identical', () => {
    const budgetCopy: Budget = JSON.parse(JSON.stringify(budgetOriginal)); // Deep copy
    const result = compareBudgets(budgetOriginal, budgetCopy);
    expect(result.added).toHaveLength(0);
    expect(result.removed).toHaveLength(0);
    expect(result.changed).toHaveLength(0);
  });

  it('should detect added items', () => {
    const budgetAmended: Budget = {
      ...budgetOriginal,
      items: [
        ...budgetOriginal.items,
        { id: '5', category: 'Environment', description: 'Park maintenance', amount: 75000, type: 'expenditure' },
      ],
    };
    const result = compareBudgets(budgetOriginal, budgetAmended);
    expect(result.added).toHaveLength(1);
    expect(result.added[0].id).toBe('5');
    expect(result.removed).toHaveLength(0);
    expect(result.changed).toHaveLength(0);
  });

  it('should detect removed items', () => {
    const budgetAmended: Budget = {
      ...budgetOriginal,
      items: budgetOriginal.items.filter(item => item.id !== '3'),
    };
    const result = compareBudgets(budgetOriginal, budgetAmended);
    expect(result.added).toHaveLength(0);
    expect(result.removed).toHaveLength(1);
    expect(result.removed[0].id).toBe('3');
    expect(result.changed).toHaveLength(0);
  });

  it('should detect changed item amounts and descriptions', () => {
    const budgetAmended: Budget = {
      ...budgetOriginal,
      items: budgetOriginal.items.map(item =>
        item.id === '2'
          ? { ...item, amount: 300000, description: 'Major road repair' }
          : item
      ),
    };
    const result = compareBudgets(budgetOriginal, budgetAmended);
    expect(result.added).toHaveLength(0);
    expect(result.removed).toHaveLength(0);
    expect(result.changed).toHaveLength(1);
    expect(result.changed[0].itemA.id).toBe('2');
    expect(result.changed[0].itemB.amount).toBe(300000);
    expect(result.changed[0].changes).toEqual(expect.arrayContaining(['amount', 'description']));
  });

  it('should handle a mix of added, removed, and changed items', () => {
    const budgetAmended: Budget = {
      id: 'b2',
      name: 'Amended Budget 2023',
      year: 2023,
      items: [
        { id: '1', category: 'Education', description: 'School supplies', amount: 90000, type: 'expenditure' }, // Changed amount
        // Item '2' (Road repair) is removed
        { id: '3', category: 'Arts', description: 'Art gallery funding', amount: 50000, type: 'expenditure' }, // Changed category & description
        { id: '4', category: 'Revenue', description: 'Property taxes', amount: 500000, type: 'revenue' },
        { id: '6', category: 'Health', description: 'Community health program', amount: 120000, type: 'expenditure' }, // Added
      ],
    };
    const result = compareBudgets(budgetOriginal, budgetAmended);

    expect(result.added).toHaveLength(1);
    expect(result.added[0].id).toBe('6');

    expect(result.removed).toHaveLength(1);
    expect(result.removed[0].id).toBe('2');

    expect(result.changed).toHaveLength(2);
    // Check item '1' change
    const changed1 = result.changed.find(c => c.itemA.id === '1');
    expect(changed1).toBeDefined();
    expect(changed1?.changes).toEqual(expect.arrayContaining(['amount']));
    // Check item '3' change
    const changed3 = result.changed.find(c => c.itemA.id === '3');
    expect(changed3).toBeDefined();
    expect(changed3?.changes).toEqual(expect.arrayContaining(['category', 'description']));
  });

  it('should handle empty budgets gracefully', () => {
    const emptyBudget: Budget = { id: 'b0', name: 'Empty', year: 2023, items: [] };
    const result = compareBudgets(emptyBudget, budgetOriginal);
    expect(result.added).toHaveLength(budgetOriginal.items.length);
    expect(result.removed).toHaveLength(0);
    expect(result.changed).toHaveLength(0);

    const result2 = compareBudgets(budgetOriginal, emptyBudget);
    expect(result2.added).toHaveLength(0);
    expect(result2.removed).toHaveLength(budgetOriginal.items.length);
    expect(result2.changed).toHaveLength(0);
  });
});
