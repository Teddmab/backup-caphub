# Afrotouch Booking System

A modern, beautiful booking system for Afrotouch OU - Premium African Hair Salon in Estonia.

## 🌟 Features

- **Hero Section**: Dynamic image carousel with call-to-action
- **Service Showcase**: Display of braiding, dreadlocks, and natural hair services
- **Stylist Profiles**: Detailed profiles with ratings, specialties, and portfolio galleries
- **Booking System**: Interactive appointment booking with date/time picker
- **Gallery**: Masonry-style photo grid with filtering by style
- **Product Shop**: E-commerce functionality with cart and product details
- **User Dashboard**: Appointment management and loyalty rewards tracking
- **Authentication**: Firebase-powered login/signup system
- **Language Toggle**: Support for English and Estonian (EN/ET)
- **Loyalty Program**: Points system with Bronze, Silver, and Gold tiers

## 🎨 Design

- **Color Palette**:
  - Background: `#F8F8F8`, `#E0E0E0`
  - Terracotta: `#C26B5B`
  - Gold: `#D4AF37`
  - Forest Green: `#224D3E`

- **Typography**:
  - Headings: Montserrat Bold
  - Body: Inter Regular

## 🚀 Tech Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS v4
- **Backend**: Firebase
  - Authentication
  - Firestore Database
  - Storage
- **TypeScript**: Full type safety
- **Date Picker**: react-day-picker

## 📁 Project Structure

```
afrotouch-booking/
├── frontend/
│   ├── app/                    # Next.js pages
│   │   ├── account/           # User dashboard
│   │   ├── booking/           # Appointment booking
│   │   ├── gallery/           # Photo gallery
│   │   ├── login/             # Login page
│   │   ├── products/          # Product shop
│   │   ├── signup/            # Signup page
│   │   ├── stylists/          # Stylist listings
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   │   ├── booking/           # Booking form
│   │   ├── hero/              # Hero section
│   │   ├── navigation/        # Navbar
│   │   ├── products/          # Product cards
│   │   └── stylist/           # Stylist cards
│   ├── lib/                   # Libraries & utilities
│   │   └── firebase/          # Firebase config & types
│   └── public/                # Static assets
├── firebase/                  # Firebase functions
└── public/                    # Shared assets
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd afrotouch-booking/frontend
npm install
```

### 2. Firebase Configuration

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Enable Storage
5. Copy your Firebase config

### 3. Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 4. Add Images

Place your images in the `frontend/public/images/` directory:
- `hero-1.jpg` to `hero-4.jpg` - Hero carousel images
- `stylist-1.jpg` to `stylist-3.jpg` - Stylist profile photos
- `gallery-1.jpg` to `gallery-8.jpg` - Gallery images
- `product-1.jpg` to `product-6.jpg` - Product photos
- `work-1.jpg` to `work-6.jpg` - Stylist portfolio images

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📱 Pages

- **Home** (`/`) - Hero, services, and overview
- **Stylists** (`/stylists`) - List of all stylists
- **Stylist Detail** (`/stylists/[id]`) - Individual stylist profile
- **Gallery** (`/gallery`) - Photo gallery with filters
- **Products** (`/products`) - Product shop
- **Product Detail** (`/products/[id]`) - Individual product page
- **Booking** (`/booking`) - Appointment booking form
- **Account** (`/account`) - User dashboard
- **Login** (`/login`) - User login
- **Signup** (`/signup`) - User registration

## 🔥 Firebase Collections

### Users
```typescript
{
  id: string;
  email: string;
  name: string;
  phone: string;
  loyaltyPoints: number;
  createdAt: Date;
}
```

### Bookings
```typescript
{
  id: string;
  userId: string;
  stylistId: string;
  serviceId: string;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
}
```

### Stylists
```typescript
{
  id: string;
  name: string;
  bio: string;
  profileImage: string;
  rating: number;
  specialties: string[];
  galleryImages: string[];
  available: boolean;
}
```

### Products
```typescript
{
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  inStock: boolean;
  reviews: ProductReview[];
}
```

## 🎯 Next Steps

1. **Add Real Data**: Replace mock data with actual Firebase data
2. **Image Upload**: Implement image upload functionality for stylists and products
3. **Payment Integration**: Add Stripe for product purchases
4. **Email Notifications**: Send booking confirmations via email
5. **Admin Dashboard**: Create admin panel for managing bookings and content
6. **Reviews System**: Allow users to leave reviews for stylists and products
7. **Calendar Integration**: Sync appointments with Google Calendar
8. **Mobile App**: Consider building a React Native mobile app

## 📝 License

© 2025 Afrotouch OU. All rights reserved.

## 🤝 Support

For questions or support, contact: info@afrotouch.ee
```

