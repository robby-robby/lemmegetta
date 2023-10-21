/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  type PaymentCards,
  PaymentCardsDefault,
  PaymentCardsSchemaValid,
} from "~/models/cards";

export type PaymentRouterType = typeof paymentSettingsRouter;

const serializeSettings = (cards: PaymentCards) => {
  const result = [];
  for (const payment of Object.keys(cards) as Array<keyof PaymentCards>) {
    const name: string = payment;
    const value = JSON.stringify(cards[payment]);
    result.push({ name, value });
  }
  return result;
};

export const paymentSettingsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const payments = await ctx.prisma.paymentSettings.findMany();
    const result = {};
    if (!payments.length) return PaymentCardsDefault;
    for (const p of payments) {
      const key = p.name;
      try {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        result[key] = JSON.parse(p.value);
      } catch (e) {
        console.error(e);
      }
    }
    return result as typeof PaymentCardsDefault;
  }),

  getDefaults: publicProcedure.query(({ ctx }) => {
    return PaymentCardsDefault;
  }),

  update: protectedProcedure
    .input(PaymentCardsSchemaValid)
    .mutation(async ({ input, ctx }) => {
      const serialized = serializeSettings(input);
      await new Promise((rs) => setTimeout(rs, 20000));
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
});
