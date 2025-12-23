# SweetBalance Backend

Diabetes management platform backend API built with Node.js, Express, TypeScript, and Prisma.

## 🚀 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM v7
- **Authentication**: JWT with bcrypt
- **Validation**: Zod schemas
- **Security**: Helmet, CORS

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up PostgreSQL Database

**Option A: Local PostgreSQL Installation**
1. Install PostgreSQL from https://www.postgresql.org/download/
2. Create a database:
```sql
CREATE DATABASE sweetbalance_db;
```

**Option B: Docker (Recommended)**
```bash
docker run --name sweetbalance-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=sweetbalance_db \
  -p 5432:5432 \
  -d postgres:14
```

### 3. Configure Environment Variables

The `.env` file is already configured:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/sweetbalance_db"
NODE_ENV="development"
PORT=3000
JWT_SECRET="your-secret-key-here"
```

**⚠️ For production**, change:
- Database password
- JWT_SECRET to a strong random value

### 4. Run Database Migrations

```bash
npm run prisma:migrate
```

This will create all tables defined in `prisma/schema.prisma`.

### 5. Seed the Database (Optional)

```bash
npm run seed
```

This creates:
- 2 test users (parent@sweetbalance.com / child@sweetbalance.com, password: password123)
- 10 blood glucose readings
- 2 diabetes goals
- 1 family with 2 members
- 3 local markets (Coop, Selver, Rimi in Tallinn)
- 15 products with nutritional data
- 4 badges
- 1 shopping list

### 6. Start Development Server

```bash
npm run dev
```

Server runs on http://localhost:3000

## 📁 Project Structure

```
src/
├── middleware/        # Auth & error handling middleware
│   ├── auth.ts
│   └── errorHandler.ts
├── routes/           # API route handlers
│   ├── auth.routes.ts
│   ├── badges.routes.ts
│   ├── family.routes.ts
│   ├── glucose.routes.ts
│   ├── goals.routes.ts
│   ├── markets.routes.ts
│   └── shopping.routes.ts
├── schemas/          # Zod validation schemas
│   └── validation.ts
├── scripts/          # Utility scripts
│   └── seed.ts
├── utils/            # Helper functions
│   └── seed.ts
└── server.ts         # Express app entry point

prisma/
└── schema.prisma     # Database schema
```

## 🔐 API Endpoints

### Authentication (Public)
- `POST /api/v1/auth/register` - Create new user
- `POST /api/v1/auth/login` - Login and get JWT token
- `GET /api/v1/auth/me` - Get current user (protected)
- `POST /api/v1/auth/logout` - Logout (protected)

### Blood Glucose (Protected)
- `POST /api/v1/glucose/readings` - Log blood glucose reading
- `GET /api/v1/glucose/readings` - Get last 30 readings
- `GET /api/v1/glucose/stats` - Get glucose statistics

### Diabetes Goals (Protected)
- `POST /api/v1/goals/goals` - Create goal
- `GET /api/v1/goals/goals` - Get all goals
- `PUT /api/v1/goals/goals/:id` - Update goal
- `DELETE /api/v1/goals/goals/:id` - Delete goal

### Family (Protected)
- `POST /api/v1/family/` - Create family
- `GET /api/v1/family/` - Get user's families

### Shopping (Protected)
- `POST /api/v1/shopping/lists` - Create shopping list
- `GET /api/v1/shopping/lists` - Get all lists

### Local Markets (Public)
- `GET /api/v1/markets/markets` - Get all markets
- `GET /api/v1/markets/markets/:id` - Get market details
- `GET /api/v1/markets/markets/:id/products` - Get market products
- `POST /api/v1/markets/preferences` - Save preference (protected)

### Badges (Mixed)
- `GET /api/v1/badges/badges` - Get all badges
- `GET /api/v1/badges/user/achievements` - Get user achievements (protected)
- `POST /api/v1/badges/unlock` - Unlock badge (protected)

### Health Check (Public)
- `GET /health` - Server health status

## 🧪 Testing the API

### Using cURL

**1. Register a new user:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "username": "testuser"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

Copy the `token` from the response.

**3. Log a blood glucose reading:**
```bash
curl -X POST http://localhost:3000/api/v1/glucose/readings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "value": 110,
    "mealBefore": true,
    "notes": "Feeling good after breakfast"
  }'
```

**4. Get glucose stats:**
```bash
curl -X GET http://localhost:3000/api/v1/glucose/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import the collection (if available) or create requests manually
2. Set environment variable `baseUrl` = `http://localhost:3000`
3. After login, set `token` variable from response
4. Use `{{token}}` in Authorization header: `Bearer {{token}}`

## 📊 Database Schema

13 models including:
- User (authentication & profile)
- BloodGlucoseReading (glucose tracking)
- DiabetesGoal (goal management)
- Family & FamilyMember (family features)
- LocalMarket & LocalMarketProduct (market data)
- ShoppingList & ShoppingListItem (shopping features)
- Badge, UserAchievement, Challenge (gamification)

See `prisma/schema.prisma` for full schema.

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT tokens with 7-day expiration
- Helmet for HTTP headers security
- CORS enabled
- Input validation with Zod
- SQL injection protection via Prisma
- Authorization middleware for protected routes

## 📝 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Compile TypeScript to JavaScript
npm start                # Run compiled server
npm run seed             # Seed database with mock data
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio GUI
npm test                 # Run tests (when configured)
```

## 🐛 Troubleshooting

### Database Connection Error
```
Error: ECONNREFUSED
```
**Solution**: Ensure PostgreSQL is running and DATABASE_URL is correct.

### Prisma Client Not Found
```
Module '@prisma/client' has no exported member 'PrismaClient'
```
**Solution**: Run `npx prisma generate`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Change PORT in `.env` or kill process using port 3000

## 🚧 Current Status

✅ **Completed:**
- Project setup with TypeScript
- Prisma schema with 13 models
- All core API routes (7 route files)
- Authentication with JWT
- Validation schemas with Zod
- Error handling middleware
- Seed script with mock data
- Security middleware (Helmet, CORS)

⚠️ **Requires Setup:**
- PostgreSQL database installation
- Database migration
- Seed data population

🔲 **Future Enhancements:**
- Unit tests with Jest
- Integration tests
- API documentation (Swagger)
- Rate limiting
- Refresh tokens
- Email verification
- Password reset
- File upload for glucose photos
- Real-time notifications

## 📄 License

ISC

## 👥 Contact

For questions or support, please contact the development team.
