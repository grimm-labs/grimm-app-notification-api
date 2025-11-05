-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "androidChannelId" TEXT,
ADD COLUMN     "badgeCount" INTEGER,
ADD COLUMN     "data" JSONB,
ADD COLUMN     "iosMessageSubtitle" TEXT,
ADD COLUMN     "ttl" INTEGER;
