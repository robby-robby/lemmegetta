import { exampleRouter } from "~/server/api/routers/example";
import { paymentSettingsRouter } from "~/server/api/routers/payments";
import { menuItemsRouter } from "~/server/api/routers/items";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  paymentSettings: paymentSettingsRouter,
  menuItems: menuItemsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
