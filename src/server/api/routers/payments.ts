/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  type PaymentCards,
  PaymentCardsDefault,
  PaymentCardsSchema,
} from "~/models/cards";
import { never } from "zod";

const serializeSettings = (cards: PaymentCards) => {
  const result = [];
  for (const payment of Object.keys(cards) as Array<keyof PaymentCards>) {
    const name: string = payment;
    const value = JSON.stringify(cards[payment]);
    result.push({ name, value });
  }
  return result;
};

/*

paymentscards object:

 PaymentCardsDefault = Object.freeze({
  Cash: {
    isEnabled: false,
  },
  CashApp: {
    isEnabled: false,
    username: "",
    urlTemplate: "https://cash.app/$<USER_NAME>/<AMOUNT>",
  },
  Venmo: {
    isEnabled: false,
    username: "",
    urlTemplate:
      "https://venmo.com/<USER_NAME>?txn=pay&note=<NOTE>&amount=<AMOUNT>",
  },
});
*/
export const paymentSettingsRouter = createTRPCRouter({
  /*
  // prisma schema:
  model PaymentSettings {
    id        String   @id @default(cuid())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    name      String
    value     String
  }
*/
  getAll: publicProcedure.query(async ({ ctx }) => {
    const payments = await ctx.prisma.paymentSettings.findMany();
    // await new Promise((rs) => setTimeout(rs, 3000));
    const result = {};
    if (!payments.length) return PaymentCardsDefault;
    for (const p of payments) {
      const key = p.name;
      try {
        //@ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        result[key] = JSON.parse(p.value);
      } catch (e) {
        //quietly fail
      }
    }
    return result as typeof PaymentCardsDefault;
  }),

  getDefaults: publicProcedure.query(({ ctx }) => {
    return PaymentCardsDefault;
  }),

  update: protectedProcedure
    .input(PaymentCardsSchema)
    .mutation(async ({ input, ctx }) => {
      const serialized = serializeSettings(input);
      // await new Promise((rs) => setTimeout(rs, 3000));
      return ctx.prisma.$transaction(
        serialized.map((item) => {
          return ctx.prisma.paymentSettings.upsert({
            create: { name: item.name, value: item.value },
            update: { value: item.value },
            where: { name: item.name },
          });
        })
      );
    }),

  // update: protectedProcedure
  //   .input(
  //     z.object({
  //       name: z.string(),
  //       value: z.string(),
  //     })
  //   )
  //   .mutation(({ input, ctx }) => {
  //     return ctx.prisma.paymentSettings.update({
  //       where: { name: input.name },
  //       data: { name: input.name, value: input.value },
  //     });
  //   }),

  // upsertMany: protectedProcedure
  //   .input(
  //     z.array(
  //       z.object({
  //         name: z.string(),
  //         value: z.string(),
  //       })
  //     )
  //   )
  //   .mutation(({ input, ctx }) => {
  //     return ctx.prisma.$transaction(
  //       input.map((item) => {
  //         return ctx.prisma.paymentSettings.upsert({
  //           create: { name: item.name, value: item.value },
  //           update: { value: item.value },
  //           where: { name: item.name },
  //         });
  //       })
  //     );
  //   }),
  // upsert: protectedProcedure
  //   .input(
  //     z.object({
  //       name: z.string(),
  //       value: z.string(),
  //     })
  //   )
  //   .mutation(({ input, ctx }) => {
  //     return ctx.prisma.paymentSettings.upsert({
  //       where: { name: input.name },
  //       update: { value: input.value },
  //       create: { name: input.name, value: input.value },
  //     });
  //   }),

  // create: protectedProcedure
  //   .input(
  //     z.object({
  //       name: z.string(),
  //       value: z.string(),
  //     })
  //   )
  //   .mutation(({ input, ctx }) => {
  //     return ctx.prisma.paymentSettings.create({
  //       data: { name: input.name, value: input.value },
  //     });
  //   }),

  // delete: protectedProcedure
  //   .input(
  //     z.object({
  //       name: z.string(),
  //     })
  //   )
  //   .mutation(({ input, ctx }) => {
  //     return ctx.prisma.paymentSettings.delete({
  //       where: { name: input.name },
  //     });
  //   }),
});
