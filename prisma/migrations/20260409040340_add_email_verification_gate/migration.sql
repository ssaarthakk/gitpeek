-- AlterTable
ALTER TABLE "LinkView" ADD COLUMN     "viewerEmail" TEXT;

-- AlterTable
ALTER TABLE "ShareLink" ADD COLUMN     "requireEmail" BOOLEAN NOT NULL DEFAULT false;
