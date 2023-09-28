import { z } from "zod";
import { ItemSchema, ItemSchemaValid } from "~/models/items";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const menuItemsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.menuItems.findMany();
  }),

  //make all fields required

  update: protectedProcedure.input(ItemSchema).mutation(({ input, ctx }) => {
    return ctx.prisma.menuItems.update({
      where: { id: input.id },
      data: {
        name: input.name,
        price: input.price,
        description: input.description,
        imageUrl: input.imageUrl,
        shortCode: input.shortCode,
      },
    });
  }),

  create: protectedProcedure
    .input(ItemSchemaValid)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.menuItems.create({
        data: {
          name: input.name,
          price: input.price,
          description: input.description,
          imageUrl: input.imageUrl,
          shortCode: input.shortCode,
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.menuItems.delete({
        where: { id: input.id },
      });
    }),
});
