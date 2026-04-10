/*
  Warnings:

  - A unique constraint covering the columns `[shareLinkId,viewerEmail]` on the table `AccessRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AccessRequest_shareLinkId_viewerEmail_key" ON "AccessRequest"("shareLinkId", "viewerEmail");
