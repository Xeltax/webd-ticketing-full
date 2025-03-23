/*
  Warnings:

  - Added the required column `image` to the `Events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Events" ADD COLUMN     "bannerUrl" TEXT[],
ADD COLUMN     "image" TEXT NOT NULL;
