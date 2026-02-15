// seed-student-budget.js
// Run this with: node seed-student-budget.js
// Make sure you have your .env file configured with DATABASE_URL

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. CREATE A TEST USER
  console.log('Creating test user...');
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'student@test.com' },
    update: {},
    create: {
      email: 'student@test.com',
      passwordHash: passwordHash,
    },
  });
  console.log(`✅ User created: ${user.email} (ID: ${user.id})`);

  // 2. CREATE CATEGORIES (typical student budget categories)
  console.log('\nCreating categories...');
  const categoryNames = [
    'tuition',
    'textbooks',
    'food',
    'groceries',
    'dining out',
    'coffee',
    'transportation',
    'gas',
    'parking',
    'entertainment',
    'streaming services',
    'rent',
    'utilities',
    'phone bill',
    'internet',
    'health',
    'gym membership',
    'clothing',
    'school supplies',
    'laundry',
    'personal care',
    'social',
    'travel',
    'savings',
    'emergency fund'
  ];

  const categories = [];
  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name: name.toLowerCase() },
      update: {},
      create: { name: name.toLowerCase() },
    });
    categories.push(category);
    console.log(`  ✅ ${category.name}`);
  }

  // Helper to get category by name
  const getCategoryId = (name) => {
    return categories.find(c => c.name === name.toLowerCase()).id;
  };

  // 3. CREATE BUDGETS (monthly budgets for current period)
  console.log('\nCreating budgets...');
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const budgetData = [
    { category: 'food', limit: 400 },
    { category: 'groceries', limit: 250 },
    { category: 'dining out', limit: 150 },
    { category: 'coffee', limit: 80 },
    { category: 'transportation', limit: 100 },
    { category: 'gas', limit: 120 },
    { category: 'entertainment', limit: 100 },
    { category: 'streaming services', limit: 30 },
    { category: 'utilities', limit: 80 },
    { category: 'phone bill', limit: 50 },
    { category: 'gym membership', limit: 40 },
    { category: 'clothing', limit: 100 },
    { category: 'school supplies', limit: 50 },
    { category: 'personal care', limit: 60 },
    { category: 'social', limit: 80 },
  ];

  for (const { category, limit } of budgetData) {
    const budget = await prisma.budget.create({
      data: {
        userId: user.id,
        categoryId: getCategoryId(category),
        limit: limit,
        period: 'monthly',
        startDate: monthStart,
        endDate: monthEnd,
      },
    });
    console.log(`  ✅ ${category}: $${limit}/month`);
  }

  // 4. CREATE EXPENSES (realistic student expenses over the past 30 days)
  console.log('\nCreating expenses...');
  
  const expenseData = [
    // Food & Dining
    { category: 'groceries', amount: 45.67, date: -28, note: 'Walmart weekly shopping' },
    { category: 'groceries', amount: 52.34, date: -21, note: 'Trader Joes' },
    { category: 'groceries', amount: 38.92, date: -14, note: 'Aldi run' },
    { category: 'groceries', amount: 61.23, date: -7, note: 'Weekly groceries' },
    { category: 'groceries', amount: 44.55, date: -2, note: 'Quick grocery run' },
    
    { category: 'dining out', amount: 18.50, date: -27, note: 'Chipotle with friends' },
    { category: 'dining out', amount: 25.75, date: -24, note: 'Pizza Friday' },
    { category: 'dining out', amount: 32.40, date: -18, note: 'Dinner date' },
    { category: 'dining out', amount: 15.20, date: -12, note: 'Subway lunch' },
    { category: 'dining out', amount: 22.80, date: -8, note: 'Thai takeout' },
    { category: 'dining out', amount: 19.90, date: -3, note: 'Late night Taco Bell' },
    
    { category: 'coffee', amount: 5.45, date: -29, note: 'Starbucks latte' },
    { category: 'coffee', amount: 4.20, date: -26, note: 'Morning coffee' },
    { category: 'coffee', amount: 6.75, date: -23, note: 'Study session at cafe' },
    { category: 'coffee', amount: 5.10, date: -20, note: 'Coffee before class' },
    { category: 'coffee', amount: 7.30, date: -17, note: 'Coffee + pastry' },
    { category: 'coffee', amount: 4.95, date: -15, note: 'Quick coffee' },
    { category: 'coffee', amount: 5.60, date: -11, note: 'Afternoon pick-me-up' },
    { category: 'coffee', amount: 6.25, date: -6, note: 'Study fuel' },
    { category: 'coffee', amount: 4.80, date: -2, note: 'Morning coffee' },

    // Transportation
    { category: 'gas', amount: 35.00, date: -25, note: 'Gas fill-up' },
    { category: 'gas', amount: 40.50, date: -15, note: 'Gas station' },
    { category: 'gas', amount: 38.75, date: -5, note: 'Weekly gas' },
    { category: 'parking', amount: 8.00, date: -22, note: 'Campus parking' },
    { category: 'parking', amount: 12.00, date: -16, note: 'Downtown parking' },
    { category: 'transportation', amount: 20.00, date: -19, note: 'Uber to airport' },

    // Entertainment
    { category: 'entertainment', amount: 15.99, date: -28, note: 'Movie ticket' },
    { category: 'entertainment', amount: 12.50, date: -20, note: 'Bowling with friends' },
    { category: 'entertainment', amount: 25.00, date: -13, note: 'Concert ticket' },
    { category: 'entertainment', amount: 18.75, date: -7, note: 'Mini golf date' },
    { category: 'streaming services', amount: 14.99, date: -1, note: 'Netflix monthly' },
    { category: 'streaming services', amount: 10.99, date: -1, note: 'Spotify Premium' },

    // Bills & Subscriptions
    { category: 'phone bill', amount: 50.00, date: -5, note: 'Monthly phone bill' },
    { category: 'utilities', amount: 42.30, date: -10, note: 'Electric bill' },
    { category: 'utilities', amount: 28.50, date: -10, note: 'Water bill' },
    { category: 'internet', amount: 55.00, date: -8, note: 'Internet monthly' },
    { category: 'gym membership', amount: 39.99, date: -3, note: 'Planet Fitness' },

    // School & Supplies
    { category: 'textbooks', amount: 89.99, date: -29, note: 'Used calculus textbook' },
    { category: 'textbooks', amount: 45.00, date: -28, note: 'E-textbook rental' },
    { category: 'school supplies', amount: 23.50, date: -27, note: 'Notebooks and pens' },
    { category: 'school supplies', amount: 15.75, date: -14, note: 'Printer ink' },

    // Personal Care
    { category: 'personal care', amount: 12.99, date: -24, note: 'Shampoo & soap' },
    { category: 'personal care', amount: 25.50, date: -18, note: 'Haircut' },
    { category: 'personal care', amount: 8.75, date: -9, note: 'Toothpaste & essentials' },
    { category: 'laundry', amount: 6.00, date: -21, note: 'Laundromat' },
    { category: 'laundry', amount: 6.00, date: -7, note: 'Laundry & detergent' },

    // Clothing
    { category: 'clothing', amount: 34.99, date: -26, note: 'New shoes' },
    { category: 'clothing', amount: 19.99, date: -11, note: 'T-shirts on sale' },

    // Social
    { category: 'social', amount: 30.00, date: -23, note: 'Friend birthday gift' },
    { category: 'social', amount: 15.50, date: -17, note: 'Drinks with friends' },
    { category: 'social', amount: 22.00, date: -4, note: 'Group dinner split' },
  ];

  for (const { category, amount, date, note } of expenseData) {
    const expenseDate = new Date();
    expenseDate.setDate(expenseDate.getDate() + date); // date is negative days ago

    const expense = await prisma.expense.create({
      data: {
        userId: user.id,
        categoryId: getCategoryId(category),
        amount: amount,
        expenseDate: expenseDate,
        note: note,
      },
    });
  }
  console.log(`  ✅ Created ${expenseData.length} expenses`);

  console.log('\n✨ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   User: ${user.email} / password: password123`);
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Budgets: ${budgetData.length}`);
  console.log(`   Expenses: ${expenseData.length}`);
  console.log('\n🎯 You can now login and test the app!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
