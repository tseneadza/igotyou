# IGotYou - AI-Powered Workplace Petition Platform

<p align="center">
  <strong>✊ Your Workplace Voice, Amplified</strong>
</p>

IGotYou is an AI-powered petition platform specifically designed for workplace advocacy. Create compelling petitions with AI assistance, build solidarity, track progress, and drive real change at your company.

## Features

### Core Features
- **Petition Creation** - Create, edit, and manage workplace petitions
- **Signature Collection** - Email-verified signatures with progress tracking
- **Social Sharing** - Share petitions via social media, email, or QR codes
- **Real-time Progress** - Visual progress meters with milestone celebrations

### AI-Powered Features
- **AI Drafting Assistant** - Conversational AI helps craft compelling petitions
- **Success Prediction** - ML-based prediction of petition success likelihood
- **Strategy Coaching** - AI-powered tips on timing, targeting, and escalation

### Workplace-Specific Features
- **Tiered Verification** - From basic email to verified employee status
- **Anonymous Signing** - Sign anonymously while maintaining verification
- **QR Code Sharing** - Generate QR codes for break room flyers and handouts
- **Category Templates** - Pre-built templates for common workplace issues

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: OpenAI GPT-4 API
- **Styling**: Tailwind CSS
- **QR Codes**: qrcode + react-qr-code

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI API key (optional for development)

### Installation

1. Clone the repository:
```bash
cd igotyou
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and API keys
```

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/igotyou"

# NextAuth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# OpenAI (optional - uses mock responses in dev)
OPENAI_API_KEY=""

# Email (optional)
RESEND_API_KEY=""
```

## Project Structure

```
igotyou/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── api/              # API routes
│   │   │   ├── ai/           # AI drafting & prediction
│   │   │   ├── petitions/    # Petition CRUD
│   │   │   ├── signatures/   # Signature collection
│   │   │   └── qr/           # QR code generation
│   │   ├── create/           # Petition creation page
│   │   ├── explore/          # Browse petitions
│   │   ├── login/            # Authentication
│   │   └── p/[slug]/         # Petition view & sign
│   ├── components/
│   │   ├── ai/               # AI chat, predictor
│   │   ├── petition/         # Cards, forms, progress
│   │   └── ui/               # Buttons, inputs, etc.
│   ├── lib/
│   │   ├── ai.ts             # OpenAI integration
│   │   ├── auth.ts           # NextAuth config
│   │   ├── db.ts             # Prisma client
│   │   └── qr.ts             # QR code utilities
│   └── types/
│       └── index.ts          # TypeScript types
├── prisma/
│   └── schema.prisma         # Database schema
└── app.json                  # Hub integration
```

## Petition Categories

- Pay Equity
- Benefits
- Workplace Safety
- Remote Work
- Layoffs
- Harassment
- Discrimination
- Union/Organizing
- Policy Change
- Environmental
- Other

## API Endpoints

### Petitions
- `GET /api/petitions` - List petitions
- `POST /api/petitions` - Create petition
- `GET /api/petitions/[slug]` - Get petition details
- `PATCH /api/petitions/[slug]` - Update petition

### Signatures
- `POST /api/signatures` - Sign petition
- `GET /api/signatures?petitionId=xxx` - List signatures

### AI
- `POST /api/ai/draft` - AI drafting conversation
- `POST /api/ai/predict` - Success prediction

### QR Codes
- `GET /api/qr/[petitionId]?format=png|svg` - Generate QR code

## Development

### Running Tests
```bash
npm test
```

### Database Migrations
```bash
npx prisma migrate dev --name your_migration_name
```

### Seeding Data
```bash
npx prisma db seed
```

## Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables
3. Deploy

### Database Hosting
- Supabase (free tier available)
- Neon (free tier available)
- Railway

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

---

<p align="center">
  <strong>Solidarity Forever ✊</strong>
</p>
