-- CreateTable
CREATE TABLE "public"."LinkView" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "shareLinkId" TEXT NOT NULL,

    CONSTRAINT "LinkView_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."LinkView" ADD CONSTRAINT "LinkView_shareLinkId_fkey" FOREIGN KEY ("shareLinkId") REFERENCES "public"."ShareLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;
