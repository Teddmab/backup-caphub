"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const bcrypt_1 = __importDefault(require("bcrypt"));
async function seedDatabase(prisma) {
    console.log('🌱 Starting database seed...');
    // Clear existing data
    await prisma.userAchievement.deleteMany();
    await prisma.badge.deleteMany();
    await prisma.shoppingListItem.deleteMany();
    await prisma.shoppingList.deleteMany();
    await prisma.localMarketPreference.deleteMany();
    await prisma.localMarketProduct.deleteMany();
    await prisma.localMarket.deleteMany();
    await prisma.familyMember.deleteMany();
    await prisma.family.deleteMany();
    await prisma.diabetesGoal.deleteMany();
    await prisma.bloodGlucoseReading.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Cleared existing data');
    // Create Users
    const hashedPassword = await bcrypt_1.default.hash('password123', 10);
    const user1 = await prisma.user.create({
        data: {
            email: 'parent@sweetbalance.com',
            password: hashedPassword,
            username: 'parent_user',
            firstName: 'Anna',
            lastName: 'Smith'
        }
    });
    const user2 = await prisma.user.create({
        data: {
            email: 'child@sweetbalance.com',
            password: hashedPassword,
            username: 'child_user',
            firstName: 'Emma',
            lastName: 'Smith'
        }
    });
    console.log('✅ Created 2 test users');
    // Create Blood Glucose Readings for user1
    const readings = [];
    for (let i = 0; i < 10; i++) {
        const daysAgo = Math.floor(i / 2);
        const timestamp = new Date();
        timestamp.setDate(timestamp.getDate() - daysAgo);
        readings.push({
            userId: user1.id,
            value: 80 + Math.floor(Math.random() * 60), // 80-140 mg/dL
            timestamp,
            mealBefore: i % 2 === 0,
            activity: i % 3 === 0 ? 'walking' : null,
            notes: i % 4 === 0 ? 'Feeling good' : null
        });
    }
    await prisma.bloodGlucoseReading.createMany({ data: readings });
    console.log('✅ Created 10 blood glucose readings');
    // Create Diabetes Goals
    await prisma.diabetesGoal.createMany({
        data: [
            {
                userId: user1.id,
                title: 'Maintain blood sugar below 120',
                description: 'Keep fasting blood sugar under 120 mg/dL',
                targetValue: 120,
                currentValue: 110,
                status: 'active'
            },
            {
                userId: user1.id,
                title: 'Exercise 3 times per week',
                description: 'Complete 30 minutes of exercise',
                targetValue: 3,
                currentValue: 2,
                status: 'active'
            }
        ]
    });
    console.log('✅ Created 2 diabetes goals');
    // Create Family
    const family = await prisma.family.create({
        data: {
            name: 'Smith Family',
            members: {
                create: [
                    {
                        userId: user1.id,
                        role: 'parent'
                    },
                    {
                        userId: user2.id,
                        role: 'child'
                    }
                ]
            }
        }
    });
    console.log('✅ Created 1 family with 2 members');
    // Create Local Markets
    const coop = await prisma.localMarket.create({
        data: {
            name: 'Coop',
            type: 'supermarket',
            address: 'Tallinn Old Town, Estonia',
            lat: 59.4370,
            lng: 24.7536,
            hours: 'Mon-Sun: 8:00-22:00',
            website: 'https://www.coop.ee',
            phone: '+372 600 0000'
        }
    });
    const selver = await prisma.localMarket.create({
        data: {
            name: 'Selver',
            type: 'supermarket',
            address: 'Viru Keskus, Tallinn',
            lat: 59.4378,
            lng: 24.7574,
            hours: 'Mon-Sun: 9:00-21:00',
            website: 'https://www.selver.ee',
            phone: '+372 667 0000'
        }
    });
    const rimi = await prisma.localMarket.create({
        data: {
            name: 'Rimi',
            type: 'supermarket',
            address: 'Kristiine Keskus, Tallinn',
            lat: 59.4292,
            lng: 24.7158,
            hours: 'Mon-Sun: 8:00-23:00',
            website: 'https://www.rimi.ee',
            phone: '+372 600 5000'
        }
    });
    console.log('✅ Created 3 local markets');
    // Create Products for each market
    const productData = [
        { name: 'Whole Wheat Bread', category: 'bakery', price: 1.99, calories: 240, carbs: 46, protein: 8, fat: 3, glycemicIndex: 51 },
        { name: 'Fresh Salmon', category: 'fish', price: 12.99, calories: 206, carbs: 0, protein: 22, fat: 13, glycemicIndex: 0 },
        { name: 'Greek Yogurt', category: 'dairy', price: 2.49, calories: 100, carbs: 6, protein: 17, fat: 0, glycemicIndex: 11 },
        { name: 'Quinoa', category: 'grains', price: 4.99, calories: 120, carbs: 21, protein: 4, fat: 2, glycemicIndex: 53 },
        { name: 'Spinach (500g)', category: 'vegetables', price: 2.29, calories: 23, carbs: 4, protein: 3, fat: 0, glycemicIndex: 15 }
    ];
    for (const market of [coop, selver, rimi]) {
        await prisma.localMarketProduct.createMany({
            data: productData.map(p => ({
                marketId: market.id,
                ...p
            }))
        });
    }
    console.log('✅ Created 15 products (5 per market)');
    // Create Shopping List
    await prisma.shoppingList.create({
        data: {
            userId: user1.id,
            title: 'Weekly Groceries',
            status: 'active',
            items: {
                create: [
                    { name: 'Whole Wheat Bread', quantity: 2, unit: 'loaves', checked: false },
                    { name: 'Fresh Salmon', quantity: 1, unit: 'kg', checked: false },
                    { name: 'Greek Yogurt', quantity: 4, unit: 'cups', checked: true },
                    { name: 'Quinoa', quantity: 1, unit: 'bag', checked: false },
                    { name: 'Spinach', quantity: 2, unit: 'bags', checked: false }
                ]
            }
        }
    });
    console.log('✅ Created 1 shopping list with 5 items');
    // Create Badges
    const badges = await prisma.badge.createMany({
        data: [
            {
                name: 'First Reading',
                description: 'Logged your first blood glucose reading',
                icon: '🩸',
                category: 'health'
            },
            {
                name: 'Healthy Week',
                description: 'Maintained healthy glucose levels for 7 days',
                icon: '💚',
                category: 'health'
            },
            {
                name: 'Meal Planner',
                description: 'Created 5 balanced meal plans',
                icon: '🥗',
                category: 'nutrition'
            },
            {
                name: 'Family Champion',
                description: 'Helped 3 family members with their health goals',
                icon: '👨‍👩‍👧',
                category: 'family'
            }
        ]
    });
    console.log('✅ Created 4 badges');
    console.log('🎉 Database seeding completed successfully!');
}
