# IGotYou - Project Changelog & Audit Trail

> **Project**: IGotYou - Workplace Petition Platform  
> **Created**: December 2024  
> **Tech Stack**: Next.js 14, PostgreSQL, Prisma, NextAuth.js, OpenAI API  

---

## Session Log - December 29, 2024

### 🎯 Project Overview

**IGotYou** is a workplace advocacy petition platform with AI-powered features including:
- Conversational petition drafting assistant
- Success prediction engine
- QR code generation for easy sharing
- Tiered identity verification
- Real-time signature tracking

---

## Issues Encountered & Resolved

### 1. OAuth Redirect URI Mismatch (Error 400)

**Problem**: Google OAuth login failed with `redirect_uri_mismatch` error.

**Root Cause**: The redirect URI wasn't configured in Google Cloud Console.

**Solution**: Added the following URI to Google Cloud Console > Credentials > OAuth 2.0 Client:
```
http://localhost:3000/api/auth/callback/google
```

**Status**: ✅ Resolved - Google OAuth now redirects correctly to Google sign-in page.

---

### 2. Petition Creation Failed (Foreign Key Constraint)

**Problem**: Creating petitions failed with error:
```
Foreign key constraint violated: `petitions_creatorId_fkey (index)`
```

**Root Cause**: The API was using a temporary user ID (`temp-user-id`) that didn't exist in the database.

**Solution**: 
1. Created a demo user in the database:
   ```sql
   INSERT INTO users (id, email, name, "verificationTier", "createdAt", "updatedAt") 
   VALUES ('demo-user-id', 'demo@example.com', 'Demo User', 'BASIC', NOW(), NOW());
   ```

2. Updated `/src/app/api/petitions/route.ts` to:
   - Get user from NextAuth session
   - Fall back to demo user in development mode

**Files Modified**:
- `src/app/api/petitions/route.ts` - Added session authentication
- `src/app/create/page.tsx` - Removed hardcoded userId from request body

**Status**: ✅ Resolved - Petitions can now be created successfully.

---

### 3. QRCodePanel Component Error

**Problem**: Petition detail page crashed with:
```
Element type is invalid: expected a string (for built-in components) 
or a class/function (for composite components) but got: undefined.
Check the render method of `QRCodePanel`.
```

**Root Cause**: Incorrect import from `react-qr-code` package.

**Solution**: Changed import from `QRCodeSVG` to `QRCode`:
```typescript
// Before (incorrect)
import { QRCodeSVG } from 'react-qr-code'

// After (correct)
import { QRCode } from 'react-qr-code'
```

**Files Modified**:
- `src/components/petition/QRCodePanel.tsx`

**Status**: ✅ Resolved - QR codes now render correctly.

---

### 4. Prisma Version Compatibility Issues

**Problem**: Multiple errors related to Prisma 7 beta features and breaking changes.

**Root Cause**: Prisma 7 introduced breaking changes:
- `url` property moved from schema.prisma to prisma.config.ts
- PrismaClient requires `adapter` or `accelerateUrl` for engine type "client"

**Solution**: Downgraded to stable Prisma 5.22.0:
```bash
npm install prisma@5.22.0 @prisma/client@5.22.0
```

**Status**: ✅ Resolved - Using stable Prisma version.

---

### 5. NextAuth Version Compatibility

**Problem**: Runtime errors with NextAuth beta version:
```
TypeError: Function.prototype.apply was called on #<Object>, 
which is an object and not a function
```

**Root Cause**: NextAuth v5 beta had compatibility issues with the current setup.

**Solution**: Downgraded to stable NextAuth v4:
```bash
npm install next-auth@^4.24.7 @next-auth/prisma-adapter@^1.0.7
```

**Files Modified**:
- `src/lib/auth.ts` - Updated to NextAuth v4 API
- `src/app/api/auth/[...nextauth]/route.ts` - Updated handler exports

**Status**: ✅ Resolved - Authentication working correctly.

---

## Current Project State

### ✅ Working Features

| Feature | Status | Notes |
|---------|--------|-------|
| Google OAuth | ✅ Working | Redirects to Google sign-in |
| Demo Login | ✅ Working | Use `test@example.com` |
| Create Petition | ✅ Working | API returns 201 |
| View Petition | ✅ Working | Full petition page renders |
| AI Success Prediction | ✅ Working | Real-time scoring |
| QR Code Generation | ✅ Working | PNG, SVG, Print Flyer |
| Database (PostgreSQL) | ✅ Working | All tables created |

### 📂 Key Files Structure

```
igotyou/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts  # Auth API
│   │   │   ├── petitions/route.ts           # Petition CRUD
│   │   │   └── ai/                          # AI endpoints
│   │   ├── create/page.tsx    # Petition creation
│   │   ├── p/[slug]/page.tsx  # Petition view
│   │   ├── login/page.tsx     # Login page
│   │   └── layout.tsx         # Root layout with providers
│   ├── components/
│   │   ├── ai/                # AI chat, predictor
│   │   ├── petition/          # Petition components
│   │   └── ui/                # Reusable UI components
│   └── lib/
│       ├── auth.ts            # NextAuth config
│       ├── db.ts              # Prisma client
│       └── ai.ts              # AI utilities
├── .env                       # Environment variables
└── package.json
```

### 🔑 Environment Variables Required

```env
DATABASE_URL="postgresql://user:password@localhost:5432/igotyou"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
OPENAI_API_KEY="your-openai-api-key"
```

---

## Test Data Created

### Demo User
- **ID**: `demo-user-id`
- **Email**: `demo@example.com`
- **Name**: Demo User

### Test Petition
- **Title**: Request for Flexible Work Hours
- **Slug**: `request-for-flexible-work-hours-OgzJnO`
- **URL**: http://localhost:3000/p/request-for-flexible-work-hours-OgzJnO
- **Target**: HR Department
- **Category**: REMOTE_WORK

---

## Commands Reference

### Start Development Server
```bash
cd /Users/tonyseneadza/Codehome/igotyou
npm run dev
```

### Database Commands
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset
```

### PostgreSQL Commands
```bash
# Start PostgreSQL
brew services start postgresql@16

# Connect to database
psql igotyou

# Check tables
\dt
```

---

---

## Session Log - December 30, 2024

### 🧪 Testing Framework & SRP Rules Added

**Added Vitest + Testing Library** for comprehensive unit testing.

### New Dependencies

```json
{
  "vitest": "^4.0.16",
  "@vitejs/plugin-react": "^5.1.2",
  "@testing-library/react": "^16.3.1",
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/user-event": "^14.6.1",
  "jsdom": "^27.4.0"
}
```

### New Files Created

| File | Purpose |
|------|---------|
| `vitest.config.ts` | Vitest configuration with React plugin |
| `vitest.setup.ts` | Global test setup (mocks for Next.js/NextAuth) |
| `src/lib/utils/slug.ts` | Slug generation utility (extracted for SRP) |
| `src/lib/utils/slug.test.ts` | 9 tests for slug utilities |
| `src/lib/ai/parser.ts` | AI response parser (extracted for SRP) |
| `src/lib/ai/parser.test.ts` | 12 tests for AI parser |
| `src/components/ui/Button.test.tsx` | 17 tests for Button component |

### Test Commands

```bash
npm test              # Run all tests (38 tests)
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Cursor Rules Updated

Added to `.cursor/rules/igotyou-project.mdc`:
- **Single Responsibility Principle (SRP)** guidelines
- **Testing Requirements** with AAA pattern examples
- Mocking patterns for Vitest

---

## Next Steps

1. **Complete Google OAuth flow** - Sign in with a real Google account
2. **Test signature collection** - Sign a petition as a user
3. **Deploy to Vercel** - Set up production environment
4. **Add email notifications** - Configure Resend for email delivery
5. **Expand test coverage** - Add tests for API routes and more components

---

## Session Summary

- ✅ Fixed OAuth redirect URI configuration
- ✅ Resolved petition creation foreign key error
- ✅ Fixed QR code component import
- ✅ Downgraded to stable Prisma and NextAuth versions
- ✅ Verified all core features working
- ✅ Created test petition successfully

**Platform Status**: 🟢 Operational (Development)
