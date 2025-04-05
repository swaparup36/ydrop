import { z } from 'zod';

export const createAirdropSchema = z.object({
    title: z
        .string()
        .min(3, 'Tttle must be at least 3 characters')
        .max(50, 'Tttle must be less than 50 characters'),
    description: z
        .string()
        .min(2, 'description name must be at least 2 characters')
        .max(2000, 'description name must be less than 2000 characters'),
    tokenMint: z
        .string(),
    tokenDecimal: z
        .number(),
    basedOn: z
        .enum(['subscriber', 'membership']),
    rewardLessthanOneYear: z
        .number(),
    rewardGreaterthanOneYear: z
        .number(),
    rewardGreaterthanTwoYears: z
        .number(),
    rewardGreaterthanThreeYears: z
        .number(),
    rewardGreaterthanFourYears: z
        .number(),
    rewardGreaterthanFiveYears: z
        .number(),
    totalRecipientLessthanOneYear: z
        .number(),
    totalRecipientGreaterthanOneYear: z
        .number(),
    totalRecipientGreaterthanTwoYears: z
        .number(),
    totalRecipientGreaterthanThreeYears: z
        .number(),
    totalRecipientGreaterthanFourYears: z
        .number(),
    totalRecipientGreaterthanFiveYears: z
        .number(),
});