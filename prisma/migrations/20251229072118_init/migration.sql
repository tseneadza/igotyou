-- CreateEnum
CREATE TYPE "VerificationTier" AS ENUM ('BASIC', 'VERIFIED_EMAIL', 'VERIFIED_EMPLOYEE', 'ANONYMIZED_VERIFIED');

-- CreateEnum
CREATE TYPE "PetitionStatus" AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED', 'VICTORY', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE', 'INTERNAL');

-- CreateEnum
CREATE TYPE "PetitionCategory" AS ENUM ('PAY_EQUITY', 'BENEFITS', 'WORKPLACE_SAFETY', 'REMOTE_WORK', 'LAYOFFS', 'HARASSMENT', 'DISCRIMINATION', 'UNION', 'POLICY_CHANGE', 'ENVIRONMENTAL', 'OTHER');

-- CreateEnum
CREATE TYPE "SignatureSource" AS ENUM ('DIRECT', 'QR_CODE', 'SHARE', 'EMAIL');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "name" TEXT,
    "image" TEXT,
    "verificationTier" "VerificationTier" NOT NULL DEFAULT 'BASIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "petitions" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "targetEmail" TEXT,
    "company" TEXT,
    "category" "PetitionCategory" NOT NULL,
    "goal" INTEGER NOT NULL,
    "status" "PetitionStatus" NOT NULL DEFAULT 'ACTIVE',
    "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
    "aiDraftHistory" JSONB,
    "successScore" DOUBLE PRECISION,
    "qrScans" INTEGER NOT NULL DEFAULT 0,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),
    "searchVector" TEXT,

    CONSTRAINT "petitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "petition_updates" (
    "id" TEXT NOT NULL,
    "petitionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "petition_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "target_responses" (
    "id" TEXT NOT NULL,
    "petitionId" TEXT NOT NULL,
    "responder" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "target_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "signatures" (
    "id" TEXT NOT NULL,
    "petitionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "comment" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "verifiedEmployee" BOOLEAN NOT NULL DEFAULT false,
    "source" "SignatureSource" NOT NULL DEFAULT 'DIRECT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "signatures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "petitions_slug_key" ON "petitions"("slug");

-- CreateIndex
CREATE INDEX "petitions_creatorId_idx" ON "petitions"("creatorId");

-- CreateIndex
CREATE INDEX "petitions_status_idx" ON "petitions"("status");

-- CreateIndex
CREATE INDEX "petitions_company_idx" ON "petitions"("company");

-- CreateIndex
CREATE INDEX "petitions_category_idx" ON "petitions"("category");

-- CreateIndex
CREATE INDEX "petition_updates_petitionId_idx" ON "petition_updates"("petitionId");

-- CreateIndex
CREATE INDEX "target_responses_petitionId_idx" ON "target_responses"("petitionId");

-- CreateIndex
CREATE INDEX "signatures_petitionId_idx" ON "signatures"("petitionId");

-- CreateIndex
CREATE INDEX "signatures_userId_idx" ON "signatures"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "signatures_petitionId_userId_key" ON "signatures"("petitionId", "userId");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "petitions" ADD CONSTRAINT "petitions_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "petition_updates" ADD CONSTRAINT "petition_updates_petitionId_fkey" FOREIGN KEY ("petitionId") REFERENCES "petitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "target_responses" ADD CONSTRAINT "target_responses_petitionId_fkey" FOREIGN KEY ("petitionId") REFERENCES "petitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signatures" ADD CONSTRAINT "signatures_petitionId_fkey" FOREIGN KEY ("petitionId") REFERENCES "petitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signatures" ADD CONSTRAINT "signatures_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
