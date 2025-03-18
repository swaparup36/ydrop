/*
  Warnings:

  - You are about to drop the `_RecipientsGreaterthanFiveYears` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RecipientsGreaterthanFourYears` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RecipientsGreaterthanOneYear` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RecipientsGreaterthanThreeYears` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RecipientsGreaterthanTwoYears` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RecipientsLessthanOneYear` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RecipientsGreaterthanFiveYears" DROP CONSTRAINT "_RecipientsGreaterthanFiveYears_A_fkey";

-- DropForeignKey
ALTER TABLE "_RecipientsGreaterthanFiveYears" DROP CONSTRAINT "_RecipientsGreaterthanFiveYears_B_fkey";

-- DropForeignKey
ALTER TABLE "_RecipientsGreaterthanFourYears" DROP CONSTRAINT "_RecipientsGreaterthanFourYears_A_fkey";

-- DropForeignKey
ALTER TABLE "_RecipientsGreaterthanFourYears" DROP CONSTRAINT "_RecipientsGreaterthanFourYears_B_fkey";

-- DropForeignKey
ALTER TABLE "_RecipientsGreaterthanOneYear" DROP CONSTRAINT "_RecipientsGreaterthanOneYear_A_fkey";

-- DropForeignKey
ALTER TABLE "_RecipientsGreaterthanOneYear" DROP CONSTRAINT "_RecipientsGreaterthanOneYear_B_fkey";

-- DropForeignKey
ALTER TABLE "_RecipientsGreaterthanThreeYears" DROP CONSTRAINT "_RecipientsGreaterthanThreeYears_A_fkey";

-- DropForeignKey
ALTER TABLE "_RecipientsGreaterthanThreeYears" DROP CONSTRAINT "_RecipientsGreaterthanThreeYears_B_fkey";

-- DropForeignKey
ALTER TABLE "_RecipientsGreaterthanTwoYears" DROP CONSTRAINT "_RecipientsGreaterthanTwoYears_A_fkey";

-- DropForeignKey
ALTER TABLE "_RecipientsGreaterthanTwoYears" DROP CONSTRAINT "_RecipientsGreaterthanTwoYears_B_fkey";

-- DropForeignKey
ALTER TABLE "_RecipientsLessthanOneYear" DROP CONSTRAINT "_RecipientsLessthanOneYear_A_fkey";

-- DropForeignKey
ALTER TABLE "_RecipientsLessthanOneYear" DROP CONSTRAINT "_RecipientsLessthanOneYear_B_fkey";

-- AlterTable
ALTER TABLE "Airdrop" ADD COLUMN     "recipientsGreaterthanFiveYears" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "recipientsGreaterthanFourYears" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "recipientsGreaterthanOneYear" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "recipientsGreaterthanThreeYears" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "recipientsGreaterthanTwoYears" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "recipientsLessthanOneYear" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- DropTable
DROP TABLE "_RecipientsGreaterthanFiveYears";

-- DropTable
DROP TABLE "_RecipientsGreaterthanFourYears";

-- DropTable
DROP TABLE "_RecipientsGreaterthanOneYear";

-- DropTable
DROP TABLE "_RecipientsGreaterthanThreeYears";

-- DropTable
DROP TABLE "_RecipientsGreaterthanTwoYears";

-- DropTable
DROP TABLE "_RecipientsLessthanOneYear";
