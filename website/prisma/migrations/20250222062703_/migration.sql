/*
  Warnings:

  - Added the required column `tokenDecimal` to the `Airdrop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenMint` to the `Airdrop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Airdrop" ADD COLUMN     "tokenDecimal" INTEGER NOT NULL,
ADD COLUMN     "tokenMint" TEXT NOT NULL;
