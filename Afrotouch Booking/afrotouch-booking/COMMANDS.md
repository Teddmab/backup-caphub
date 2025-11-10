# Useful Commands

## Development

```bash
# Start development server
cd frontend
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Firebase

```bash
# Install Firebase CLI (one-time)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Deploy to Firebase Hosting
firebase deploy
```

## Package Management

```bash
# Install all dependencies
npm install

# Add a new package
npm install package-name

# Update packages
npm update

# Check for outdated packages
npm outdated
```

## Useful Development Commands

```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npx tsc --noEmit

# Format code (if you add Prettier)
npm install -D prettier
npx prettier --write .
```

## Environment

```bash
# Copy example env file
cp .env.local.example .env.local

# Edit environment variables
nano .env.local  # or use your favorite editor
```

## Git Commands

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Add remote repository
git remote add origin your-repo-url

# Push to remote
git push -u origin main
```

## Testing the Build

```bash
# Build the project
npm run build

# Test the production build locally
npm start

# Check build output
ls -la .next
```

## Troubleshooting

```bash
# Clear all caches
rm -rf .next node_modules package-lock.json
npm install
npm run dev

# Check Node version (should be 18+)
node --version

# Check npm version
npm --version

# View detailed error logs
npm run dev --verbose
```

## Deployment Checklist

- [ ] All environment variables set
- [ ] Firebase project configured
- [ ] Images uploaded
- [ ] Production build successful (`npm run build`)
- [ ] Test booking flow
- [ ] Test user registration
- [ ] Test product purchases
- [ ] Mobile responsive testing
- [ ] Browser compatibility testing
- [ ] Performance testing

## Quick Links

- Local dev: http://localhost:3000
- Firebase Console: https://console.firebase.google.com
- Next.js Docs: https://nextjs.org/docs
- Tailwind Docs: https://tailwindcss.com/docs

