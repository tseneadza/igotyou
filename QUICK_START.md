# IGotYou - Quick Start Guide

Get IGotYou up and running in minutes.

## Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **PostgreSQL** database ([download](https://www.postgresql.org/download/) or use [Supabase](https://supabase.com) free tier)
- **OpenAI API key** (optional - uses mock responses in development)

## Quick Setup

### 1. Install Dependencies

```bash
cd igotyou
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/igotyou"

# NextAuth
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# OpenAI (optional - uses mock in dev)
OPENAI_API_KEY=""

# Email (optional)
RESEND_API_KEY=""
```

**Quick secret generation:**
```bash
openssl rand -base64 32
```

### 3. Set Up Database

```bash
# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Using the Hub

The project is integrated with the Codehome Hub. To start via the hub:

1. Ensure the hub is running (`cd hub && go run cmd/server/main.go`)
2. Navigate to `http://localhost:8081`
3. Find "IGotYou" in the app list
4. Click "Start" to launch the app

The hub will automatically:
- Start the Next.js dev server on port 3000
- Open the app in your browser
- Monitor the process

---

## Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma migrate dev    # Create and apply migration
npx prisma studio        # Open Prisma Studio (DB GUI)
npx prisma generate      # Regenerate Prisma Client

# Testing (when set up)
npm test             # Run tests
```

---

## Troubleshooting

### Database Connection Issues

**Error: Can't reach database server**

- Check PostgreSQL is running: `pg_isready`
- Verify `DATABASE_URL` in `.env` is correct
- For remote databases, check firewall/network settings

**Error: Migration failed**

- Reset database: `npx prisma migrate reset` (⚠️ deletes all data)
- Or manually fix migration conflicts

### Port Already in Use

**Error: Port 3000 is already in use**

```bash
# Find process using port 3000
lsof -ti :3000

# Kill it
kill -9 $(lsof -ti :3000)

# Or use a different port
PORT=3001 npm run dev
```

### NextAuth Issues

**Error: NEXTAUTH_SECRET is missing**

- Generate a secret: `openssl rand -base64 32`
- Add to `.env`: `NEXTAUTH_SECRET="your-secret-here"`

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

1. **Set up authentication**: Configure Google OAuth in `.env`
2. **Enable email**: Add Resend API key for email notifications
3. **Deploy**: Follow deployment guide in `README.md`
4. **Customize**: Update branding, colors, and content

---

## Getting Help

- Check `README.md` for detailed documentation
- Review `ROADMAP.md` for planned features
- See `TODO.md` for current tasks

---

*Happy petitioning! ✊*
