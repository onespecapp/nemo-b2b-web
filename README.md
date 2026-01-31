# Nemo B2B Web

Modern dashboard for managing appointment reminders. Built with Next.js 16 and Supabase.

## Features

- 🔐 **Authentication** - Sign up, sign in, password reset via Supabase Auth
- 👥 **Customer Management** - Add, edit, delete customers
- 📅 **Appointment Scheduling** - Create appointments with reminder settings
- 📊 **Dashboard** - Overview of customers and upcoming appointments
- 📞 **Call History** - Track reminder call outcomes
- ⚙️ **Settings** - Configure business details and preferences

## Tech Stack

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+
- Supabase project

### Installation

```bash
# Clone the repo
git clone https://github.com/onespecapp/nemo-b2b-web.git
cd nemo-b2b-web

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/page.tsx        # Sign in
│   ├── signup/page.tsx       # Sign up
│   ├── auth/callback/        # OAuth callback
│   └── dashboard/
│       ├── page.tsx          # Dashboard overview
│       ├── customers/        # Customer management
│       ├── appointments/     # Appointment management
│       └── settings/         # Business settings
├── components/
│   └── SignOutButton.tsx
└── lib/
    └── supabase/
        ├── client.ts         # Browser client
        ├── server.ts         # Server client
        └── middleware.ts     # Auth middleware
```

## Database Tables

The app uses these Supabase tables (with `b2b_` prefix):

- `b2b_businesses` - Business accounts
- `b2b_customers` - Customer records
- `b2b_appointments` - Scheduled appointments
- `b2b_call_logs` - Call history

See the API repo for the full schema and RLS policies.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Manual

```bash
npm run build
npm start
```

## Development

```bash
# Run dev server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## Related Projects

- [nemo-b2b-api](https://github.com/onespecapp/nemo-b2b-api) - Backend API
- [Nemo Cares](https://meetnemo.com) - Consumer app

## License

ISC

