# Quick Start Guide

## Get Your Afrotouch Booking System Running in 5 Minutes! 🚀

### Step 1: Install Everything

```bash
cd "afrotouch-booking/frontend"
npm install
```

### Step 2: Set Up Firebase (Don't worry, it's easy!)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project" and name it "Afrotouch"
3. Once created, click on the web icon (</>) to add a web app
4. Copy the config values you see

### Step 3: Add Your Firebase Keys

1. In the `frontend` folder, create a file called `.env.local`
2. Copy this and fill in your values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=paste-your-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Step 4: Enable Firebase Features

In your Firebase console:
1. Click "Authentication" → "Get Started" → Enable "Email/Password"
2. Click "Firestore Database" → "Create Database" → Start in test mode
3. Click "Storage" → "Get Started" → Start in test mode

### Step 5: Add Some Images (Optional for now)

Create placeholder images or use real ones in `frontend/public/images/`:
- Hero images: `hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg`, `hero-4.jpg`
- Stylist photos: `stylist-1.jpg`, `stylist-2.jpg`, `stylist-3.jpg`
- Gallery: `gallery-1.jpg` through `gallery-8.jpg`
- Products: `product-1.jpg` through `product-6.jpg`

**Pro tip**: You can use placeholder services like Unsplash for now!

### Step 6: Run It!

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and boom! 🎉

## What You'll See

- ✅ Beautiful hero section with image carousel
- ✅ Services section
- ✅ Navigation with language toggle
- ✅ Stylist profiles and galleries
- ✅ Booking system
- ✅ Product shop
- ✅ User accounts with loyalty program

## Common Issues

### "Firebase config error"
→ Double-check your `.env.local` file has all the keys

### "Images not loading"
→ Add placeholder images or use online URLs temporarily

### "Port 3000 already in use"
→ Run: `npm run dev -- -p 3001` to use port 3001 instead

## Next Steps

1. **Customize the design**: Edit colors in `app/globals.css`
2. **Add real data**: Replace mock data with Firebase calls
3. **Upload images**: Add your salon's actual photos
4. **Test booking**: Try making a test appointment
5. **Set up payments**: Add Stripe for product purchases

Need help? Check the full README.md!

