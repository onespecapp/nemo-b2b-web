# Nemo B2B - Appointment Reminder System

A B2B platform for businesses to send automated phone call reminders to their customers about upcoming appointments.

## Project Structure

```
nemo-b2b-web/          # Next.js frontend
nemo-b2b-backend/      # Express.js API server
nemo-b2b-livekit/      # LiveKit voice agent (Python)
```

## Tech Stack

- **Frontend**: Next.js 16, React, TailwindCSS
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **Voice Calls**: Telnyx + LiveKit

## Getting Started

### 1. Frontend (Next.js)

```bash
cd nemo-b2b-web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 2. Backend (Express)

```bash
cd nemo-b2b-backend
npm install
npm run dev:b2b
```

API runs on [http://localhost:6001](http://localhost:6001)

## Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (.env)

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
TELNYX_API_KEY=your_telnyx_key
TELNYX_PHONE_NUMBER=+1XXXXXXXXXX
PORT=6001
```

## Database Schema

Tables in Supabase:
- `businesses` - Business accounts (linked to auth.users)
- `customers` - Customer records
- `appointments` - Scheduled appointments
- `call_logs` - Call history and outcomes

## Features

- [x] Business signup/login with Supabase Auth
- [x] Customer management (CRUD)
- [x] Appointment scheduling
- [x] Dashboard with stats
- [ ] Telnyx integration for calls
- [ ] LiveKit voice agent
- [ ] Call scheduling worker
- [ ] Analytics and reporting

## Next Steps

1. Add Telnyx credentials to `.env`
2. Configure LiveKit agent for voice calls
3. Set up BullMQ worker for scheduled calls
4. Deploy to production

## License

Private - Nemo Cares
