-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "ltree";

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UP', 'DOWN');

-- CreateTable
CREATE TABLE "account" (
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

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "thread" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3),
    "node_path" ltree,
    "updated" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deep" INTEGER,
    "userId" TEXT NOT NULL,
    "communityId" TEXT,

    CONSTRAINT "thread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "userId" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "type" "VoteType" NOT NULL,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("userId","threadId")
);

-- CreateTable
CREATE TABLE "saved" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,

    CONSTRAINT "saved_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "info" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatar" TEXT,
    "header_image" TEXT,
    "background_color" TEXT NOT NULL DEFAULT '#ffffff',
    "background_image" TEXT,
    "interactive_elements_color" TEXT NOT NULL DEFAULT '#000000',

    CONSTRAINT "community_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "join_user_community" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,

    CONSTRAINT "join_user_community_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_providerAccountId_key" ON "account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "community_name_key" ON "community"("name");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thread" ADD CONSTRAINT "thread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thread" ADD CONSTRAINT "thread_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "community"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "thread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved" ADD CONSTRAINT "saved_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved" ADD CONSTRAINT "saved_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "thread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "join_user_community" ADD CONSTRAINT "join_user_community_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "join_user_community" ADD CONSTRAINT "join_user_community_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
