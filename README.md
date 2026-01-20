# CalTrack - Calories Tracker App

A modern calorie tracking application built with Next.js 14, TypeScript, shadcn/ui, and Supabase.

## Project Structure

```
/app
  /page.tsx                    - Landing page with features showcase
  /layout.tsx                  - Root layout with Inter & Poppins fonts
  /auth/login/page.tsx         - Login page
  /auth/signup/page.tsx        - Sign up page with guest data sync
  /dashboard/page.tsx          - Main dashboard with daily summary
  /foods/page.tsx              - Browse all foods by category
  /foods/add/page.tsx          - Add custom food item
  /log/page.tsx                - Food logging interface
  /calculators/page.tsx        - TDEE & Body fat calculators
  /profile/page.tsx            - User profile & settings

/components
  /ui/                         - shadcn/ui components
  /layout/navbar.tsx           - Navigation bar
  /app-wrapper.tsx             - Auth state wrapper
  /food/food-card.tsx          - Food item card
  /food/food-form.tsx          - Add/edit food form
  /food/category-tabs.tsx      - Category filter tabs
  /log/log-entry.tsx           - Log entry component
  /log/meal-section.tsx        - Meal time section
  /log/daily-summary.tsx       - Daily calorie summary
  /calculators/tdee-form.tsx   - TDEE calculator
  /calculators/body-fat-form.tsx - Body fat calculator
  /charts/calorie-chart.tsx    - Bar chart for calories
  /charts/macro-pie.tsx        - Pie chart for macros
  /charts/progress-ring.tsx    - Circular progress indicator
  /charts/weekly-trend.tsx     - Line chart for trends

/lib
  /supabase/client.ts          - Browser Supabase client
  /supabase/server.ts          - Server Supabase client
  /supabase/middleware.ts      - Auth middleware
  /storage/local-storage.ts    - Guest mode local storage
  /hooks/use-auth.ts           - Auth state hook
  /hooks/use-food-log.ts       - Food logging hook
  /utils.ts                    - Utility functions
  /constants.ts                - Default foods & categories

/types
  /database.ts                 - Database types
  /index.ts                    - App types

/supabase/migrations
  /001_initial_schema.sql      - Database schema & seed data
```

## Key Features

- **Guest Mode**: Full functionality without signup, data stored in localStorage
- **Auth**: Optional signup with automatic data sync from guest mode
- **Food Database**: 40+ pre-seeded foods in 6 categories
- **Food Logging**: Weight slider, meal time selection, nutrition preview
- **TDEE Calculator**: Mifflin-St Jeor equation with activity multipliers
- **Body Fat Calculator**: US Navy method
- **Charts**: Daily/weekly calorie charts, macro pie charts, progress rings
- **Green/Teal Theme**: Fresh health-focused design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS
- **Fonts**: Google Fonts (Inter, Poppins)
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account

### Setup

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Create a Supabase project**
   - Go to https://supabase.com and create a new project
   - Wait for the project to be ready

3. **Set up the database**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and run the contents of `supabase/migrations/001_initial_schema.sql`
   - This creates all tables, RLS policies, and seeds the default foods

4. **Configure environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase project URL and anon key (found in Project Settings > API)
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open http://localhost:3000**

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database Schema

### Tables

- **profiles**: User profile data (height, weight, age, goals)
- **food_categories**: Food categories (Proteins, Carbs, Fruits, etc.)
- **food_items**: Food items with nutritional info per 100g
- **food_logs**: User food logs with weight and meal time

### Default Food Categories

1. Proteins (chicken, beef, fish, eggs, tofu)
2. Carbs (rice, bread, pasta, oats, potatoes)
3. Fruits (apple, banana, orange, berries)
4. Vegetables (broccoli, spinach, carrots)
5. Dairy (milk, cheese, yogurt)
6. Snacks (nuts, protein bars)

## Calculators

### TDEE Calculator
Uses the Mifflin-St Jeor equation:
- Men: BMR = 10W + 6.25H - 5A + 5
- Women: BMR = 10W + 6.25H - 5A - 161
- TDEE = BMR x Activity Multiplier

Activity Multipliers:
- Sedentary: 1.2
- Light: 1.375
- Moderate: 1.55
- Active: 1.725
- Very Active: 1.9

### Body Fat Calculator
Uses the US Navy method:
- Men: 86.010 x log10(waist-neck) - 70.041 x log10(height) + 36.76
- Women: 163.205 x log10(waist+hip-neck) - 97.684 x log10(height) - 78.387

## License

MIT
