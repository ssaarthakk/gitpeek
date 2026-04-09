-- AlterTable
ALTER TABLE "ShareLink" ADD COLUMN     "ref" TEXT NOT NULL DEFAULT 'main',
ADD COLUMN     "rootPath" TEXT;
