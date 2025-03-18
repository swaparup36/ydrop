/*
  Warnings:

  - You are about to drop the column `basedOn` on the `User` table. All the data in the column will be lost.
  - Added the required column `basedOn` to the `Airdrop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Airdrop" ADD COLUMN     "basedOn" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "basedOn";
