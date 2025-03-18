-- CreateTable
CREATE TABLE "Airdrop" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL,
    "rewardLessthanOneYear" DOUBLE PRECISION NOT NULL,
    "rewardGreaterthanOneYear" DOUBLE PRECISION NOT NULL,
    "rewardGreaterthanTwoYears" DOUBLE PRECISION NOT NULL,
    "rewardGreaterthanThreeYears" DOUBLE PRECISION NOT NULL,
    "rewardGreaterthanFourYears" DOUBLE PRECISION NOT NULL,
    "rewardGreaterthanFiveYears" DOUBLE PRECISION NOT NULL,
    "channelId" TEXT NOT NULL,

    CONSTRAINT "Airdrop_pkey" PRIMARY KEY ("id")
);
