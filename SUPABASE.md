# Supabase Implementation Guide

This document explains how Supabase is integrated into the CalTrack application for authentication and database operations.

## Overview

Supabase provides two main services in this app:
1. **Authentication** - User signup, login, and session management
2. **Database** - PostgreSQL database for storing profiles, foods, and food logs

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js App                          │
├─────────────────────────────────────────────────────────────┤
│  Client Components          │  Server Components            │
│  (use 'use client')         │  (default in App Router)      │
│                             │                               │
│  ┌─────────────────────┐    │    ┌─────────────────────┐    │
│  │ lib/supabase/       │    │    │ lib/supabase/       │    │
│  │ client.ts           │    │    │ server.ts           │    │
│  │                     │    │    │                     │    │
│  │ createBrowserClient │    │    │ createServerClient  │    │
│  └─────────────────────┘    │    └─────────────────────┘    │
│            │                │              │                │
└────────────┼────────────────┼──────────────┼────────────────┘
             │                │              │
             └────────────────┼──────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │   Supabase Cloud    │
                    │  ┌───────────────┐  │
                    │  │ Auth Service  │  │
                    │  └───────────────┘  │
                    │  ┌───────────────┐  │
                    │  │  PostgreSQL   │  │
                    │  └───────────────┘  │
                    └─────────────────────┘
```

## File Structure

```
lib/supabase/
├── client.ts      # Browser-side Supabase client
├── server.ts      # Server-side Supabase client
└── middleware.ts  # Auth session refresh middleware

middleware.ts      # Next.js middleware (uses supabase/middleware.ts)
```

## Client Configuration

### Browser Client (`lib/supabase/client.ts`)

Used in Client Components (components with `'use client'` directive).

```typescript
'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Usage in components:**
```typescript
'use client'
import { createClient } from '@/lib/supabase/client'

function MyComponent() {
  const supabase = createClient()

  // Now use supabase for queries
  const { data } = await supabase.from('food_items').select('*')
}
```

### Server Client (`lib/supabase/server.ts`)

Used in Server Components, Server Actions, and Route Handlers.

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component - ignore
          }
        },
      },
    }
  )
}
```

**Key difference:** Server client needs access to cookies for session management.

### Middleware (`lib/supabase/middleware.ts`)

Refreshes auth tokens on every request to keep sessions alive.

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Update cookies in both request and response
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This refreshes the auth token
  await supabase.auth.getUser()

  return supabaseResponse
}
```

## Authentication Flow

### 1. Sign Up (`lib/hooks/use-auth.ts`)

```typescript
const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (!error && data.user) {
    // Profile is auto-created via database trigger
    // Sync any guest data to the new account
  }

  return { data, error }
}
```

### 2. Sign In

```typescript
const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return { error }
}
```

### 3. Sign Out

```typescript
const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}
```

### 4. Get Current User

```typescript
const { data: { user } } = await supabase.auth.getUser()
```

### 5. Listen to Auth Changes

```typescript
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  async (event, session) => {
    if (session?.user) {
      // User logged in
    } else {
      // User logged out
    }
  }
)

// Cleanup
return () => subscription.unsubscribe()
```

## Database Operations

### Selecting Data

```typescript
// Get all default foods
const { data, error } = await supabase
  .from('food_items')
  .select('*')
  .eq('is_default', true)

// Get foods with category (join)
const { data } = await supabase
  .from('food_items')
  .select(`
    *,
    category:food_categories(*)
  `)

// Get user's food logs for a specific date
const { data } = await supabase
  .from('food_logs')
  .select(`
    *,
    food_item:food_items(*)
  `)
  .eq('user_id', userId)
  .eq('date', '2024-01-15')
```

### Inserting Data

```typescript
// Insert a food log
const { error } = await supabase.from('food_logs').insert({
  user_id: userId,
  food_item_id: foodId,
  weight_grams: 150,
  meal_time: 'lunch',
  date: '2024-01-15',
})

// Insert and return the new record
const { data, error } = await supabase
  .from('food_items')
  .insert({ name: 'Custom Food', ... })
  .select()
  .single()
```

### Updating Data

```typescript
const { error } = await supabase
  .from('profiles')
  .update({ height_cm: 175, weight_kg: 70 })
  .eq('id', userId)
```

### Deleting Data

```typescript
const { error } = await supabase
  .from('food_logs')
  .delete()
  .eq('id', logId)
```

## Database Schema

### Tables

#### `profiles`
Extends Supabase auth.users with additional fields.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key, references auth.users |
| email | text | User's email |
| height_cm | numeric | Height in centimeters |
| weight_kg | numeric | Weight in kilograms |
| age | integer | Age in years |
| gender | text | 'male' or 'female' |
| activity_level | text | Activity level for TDEE |
| goal | text | 'lose', 'maintain', or 'gain' |

#### `food_categories`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Category name |
| icon | text | Emoji icon |
| color | text | Hex color code |

#### `food_items`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Owner (null for defaults) |
| category_id | uuid | Foreign key to categories |
| name | text | Food name |
| calories_per_100g | numeric | Calories per 100g |
| protein_per_100g | numeric | Protein per 100g |
| carbs_per_100g | numeric | Carbs per 100g |
| fat_per_100g | numeric | Fat per 100g |
| is_default | boolean | Pre-seeded food flag |

#### `food_logs`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to auth.users |
| food_item_id | uuid | Foreign key to food_items |
| weight_grams | numeric | Amount consumed |
| meal_time | text | 'breakfast', 'lunch', 'dinner', 'snack' |
| date | date | Log date |
| logged_at | timestamp | When logged |

## Row Level Security (RLS)

RLS ensures users can only access their own data.

### Profiles
```sql
-- Users can only view/edit their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### Food Items
```sql
-- Anyone can view default foods
CREATE POLICY "Anyone can view default foods" ON food_items
  FOR SELECT USING (is_default = true);

-- Users can view their own custom foods
CREATE POLICY "Users can view own custom foods" ON food_items
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert/update/delete their own foods
CREATE POLICY "Users can insert own foods" ON food_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Food Logs
```sql
-- Users can only access their own logs
CREATE POLICY "Users can view own logs" ON food_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own logs" ON food_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Auto Profile Creation

A database trigger automatically creates a profile when a user signs up:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Guest Mode Integration

The app supports guest mode (no authentication) with data stored in localStorage. When a guest signs up:

1. Guest data is retrieved from localStorage
2. User account is created via Supabase Auth
3. Profile is auto-created by database trigger
4. Guest's food logs and custom foods are synced to the database
5. localStorage is cleared

```typescript
// In use-auth.ts signUp function
const guestData = getGuestData()
const { data, error } = await supabase.auth.signUp({ email, password })

if (!error && data.user) {
  // Sync guest food logs
  for (const log of guestData.foodLogs) {
    await supabase.from('food_logs').insert({
      user_id: data.user.id,
      food_item_id: log.food_item_id,
      weight_grams: log.weight_grams,
      meal_time: log.meal_time,
      date: log.date,
    })
  }

  clearGuestData()
}
```

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Both are prefixed with `NEXT_PUBLIC_` because they're used in client-side code. The anon key is safe to expose - RLS policies protect the data.

## Common Patterns

### Loading State
```typescript
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
  const fetchData = async () => {
    const { data } = await supabase.from('food_items').select('*')
    setFoods(data)
    setIsLoading(false)
  }
  fetchData()
}, [])
```

### Error Handling
```typescript
const { data, error } = await supabase.from('food_logs').insert(logData)

if (error) {
  toast.error('Failed to log food')
  return
}

toast.success('Food logged!')
```

### Real-time Subscriptions (Optional)
```typescript
const subscription = supabase
  .channel('food_logs')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'food_logs' },
    (payload) => {
      console.log('New log:', payload.new)
    }
  )
  .subscribe()

// Cleanup
subscription.unsubscribe()
```

## Troubleshooting

### "Invalid API key"
- Check that `.env.local` has the correct `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart the dev server after changing env variables

### "Permission denied"
- Ensure RLS policies are set up correctly
- Check that the user is authenticated for protected operations

### "relation does not exist"
- Run the SQL migration in `supabase/migrations/001_initial_schema.sql`

### Session not persisting
- Ensure middleware.ts is set up to refresh sessions
- Check that cookies are being set correctly
