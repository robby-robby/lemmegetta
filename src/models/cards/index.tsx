import { z } from "zod";

export type PaymentCardInfo = {
  isEnabled: boolean;
  username: string;
  urlTemplate: string;
};

export const PaymentCardsSchema = z.object({
  CashApp: z.object({
    isEnabled: z.boolean(),
    username: z.string(),
    urlTemplate: z.string(),
  }),
  Venmo: z.object({
    isEnabled: z.boolean(),
    username: z.string(),
    urlTemplate: z.string(),
  }),
  Cash: z.object({
    isEnabled: z.boolean(),
  }),
});

export const PaymentCardsDefault = Object.freeze(
  PaymentCardsSchema.parse({
    Cash: {
      isEnabled: true,
    },
    CashApp: {
      isEnabled: true,
      username: "",
      urlTemplate: "https://cash.app/$<USER_NAME>/<AMOUNT>",
    },
    Venmo: {
      isEnabled: true,
      username: "",
      urlTemplate:
        "https://venmo.com/<USER_NAME>?txn=pay&note=<NOTE>&amount=<AMOUNT>",
    },
  })
);

export type PaymentCards = typeof PaymentCardsDefault;
