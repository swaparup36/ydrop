/*
  Warnings:

  - Added the required column `tokenName` to the `Airdrop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Airdrop" ADD COLUMN     "tokenName" TEXT NOT NULL;
