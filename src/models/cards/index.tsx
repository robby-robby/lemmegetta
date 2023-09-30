import { type inferRouterOutputs } from "@trpc/server";
import { type PaymentRouterType } from "~/server/api/routers/payments";
import { z } from "zod";

export type PaymentCardInfo = {
  isEnabled: boolean;
  username: string;
  urlTemplate: string;
};

// export type PaymentRoutes = inferRouterOutputs<PaymentRouterType>;
// export type PaymentMutateProps = PaymentRoutes["update"];
// export type PaymentMutateProps = PaymentCardInfo;
// export type PaymentMutateProps = PaymentCards;
// export type PaymentMutateProps = z.inferFlattenedErrors<
//   typeof PaymentCardsSchema
// >;

export type PaymentCardsType = typeof PaymentCardsSchema;

export type PaymentErrorsFlat = z.inferFlattenedErrors<PaymentCardsType>;

export type PaymentErrorsFormat = z.inferFormattedError<PaymentCardsType>;

export const PaymentCardsSchemaValid = z.object({
  CashApp: z.object({
    isEnabled: z.boolean(),
    username: z.string().refine((data) => data !== "", {
      message: "username is a required field",
    }),
    urlTemplate: z.string().refine((data) => data !== "", {
      message: "urlTemplate is a required field",
    }),
  }),
  Venmo: z.object({
    isEnabled: z.boolean(),
    username: z.string().refine((data) => data !== "", {
      message: "username is a required field",
    }),
    urlTemplate: z.string().refine((data) => data !== "", {
      message: "urlTemplate is a required field",
    }),
  }),
  Cash: z.object({
    isEnabled: z.boolean(),
  }),
});

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
