/*
  Warnings:

  - You are about to drop the column `moneyId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Money` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Money` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_moneyId_fkey";

-- DropIndex
DROP INDEX "User_moneyId_key";

-- AlterTable
ALTER TABLE "Money" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "moneyId";

-- CreateIndex
CREATE UNIQUE INDEX "Money_userId_key" ON "Money"("userId");

-- AddForeignKey
ALTER TABLE "Money" ADD CONSTRAINT "Money_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
