/*
  Warnings:

  - Added the required column `creatorId` to the `Airdrop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalRecipientGreaterthanFiveYears` to the `Airdrop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalRecipientGreaterthanFourYears` to the `Airdrop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalRecipientGreaterthanOneYear` to the `Airdrop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalRecipientGreaterthanThreeYears` to the `Airdrop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalRecipientGreaterthanTwoYears` to the `Airdrop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalRecipientLessthanOneYear` to the `Airdrop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `basedOn` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Airdrop" ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "totalRecipientGreaterthanFiveYears" INTEGER NOT NULL,
ADD COLUMN     "totalRecipientGreaterthanFourYears" INTEGER NOT NULL,
ADD COLUMN     "totalRecipientGreaterthanOneYear" INTEGER NOT NULL,
ADD COLUMN     "totalRecipientGreaterthanThreeYears" INTEGER NOT NULL,
ADD COLUMN     "totalRecipientGreaterthanTwoYears" INTEGER NOT NULL,
ADD COLUMN     "totalRecipientLessthanOneYear" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "basedOn" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_RecipientsLessthanOneYear" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RecipientsLessthanOneYear_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_RecipientsGreaterthanOneYear" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RecipientsGreaterthanOneYear_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_RecipientsGreaterthanTwoYears" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RecipientsGreaterthanTwoYears_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_RecipientsGreaterthanThreeYears" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RecipientsGreaterthanThreeYears_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_RecipientsGreaterthanFourYears" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RecipientsGreaterthanFourYears_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_RecipientsGreaterthanFiveYears" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RecipientsGreaterthanFiveYears_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RecipientsLessthanOneYear_B_index" ON "_RecipientsLessthanOneYear"("B");

-- CreateIndex
CREATE INDEX "_RecipientsGreaterthanOneYear_B_index" ON "_RecipientsGreaterthanOneYear"("B");

-- CreateIndex
CREATE INDEX "_RecipientsGreaterthanTwoYears_B_index" ON "_RecipientsGreaterthanTwoYears"("B");

-- CreateIndex
CREATE INDEX "_RecipientsGreaterthanThreeYears_B_index" ON "_RecipientsGreaterthanThreeYears"("B");

-- CreateIndex
CREATE INDEX "_RecipientsGreaterthanFourYears_B_index" ON "_RecipientsGreaterthanFourYears"("B");

-- CreateIndex
CREATE INDEX "_RecipientsGreaterthanFiveYears_B_index" ON "_RecipientsGreaterthanFiveYears"("B");

-- AddForeignKey
ALTER TABLE "Airdrop" ADD CONSTRAINT "Airdrop_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipientsLessthanOneYear" ADD CONSTRAINT "_RecipientsLessthanOneYear_A_fkey" FOREIGN KEY ("A") REFERENCES "Airdrop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipientsLessthanOneYear" ADD CONSTRAINT "_RecipientsLessthanOneYear_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipientsGreaterthanOneYear" ADD CONSTRAINT "_RecipientsGreaterthanOneYear_A_fkey" FOREIGN KEY ("A") REFERENCES "Airdrop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipientsGreaterthanOneYear" ADD CONSTRAINT "_RecipientsGreaterthanOneYear_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipientsGreaterthanTwoYears" ADD CONSTRAINT "_RecipientsGreaterthanTwoYears_A_fkey" FOREIGN KEY ("A") REFERENCES "Airdrop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipientsGreaterthanTwoYears" ADD CONSTRAINT "_RecipientsGreaterthanTwoYears_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipientsGreaterthanThreeYears" ADD CONSTRAINT "_RecipientsGreaterthanThreeYears_A_fkey" FOREIGN KEY ("A") REFERENCES "Airdrop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipientsGreaterthanThreeYears" ADD CONSTRAINT "_RecipientsGreaterthanThreeYears_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipientsGreaterthanFourYears" ADD CONSTRAINT "_RecipientsGreaterthanFourYears_A_fkey" FOREIGN KEY ("A") REFERENCES "Airdrop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipientsGreaterthanFourYears" ADD CONSTRAINT "_RecipientsGreaterthanFourYears_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipientsGreaterthanFiveYears" ADD CONSTRAINT "_RecipientsGreaterthanFiveYears_A_fkey" FOREIGN KEY ("A") REFERENCES "Airdrop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipientsGreaterthanFiveYears" ADD CONSTRAINT "_RecipientsGreaterthanFiveYears_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
