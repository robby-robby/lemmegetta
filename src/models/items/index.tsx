import type { inferRouterOutputs } from "@trpc/server";
import { z } from "zod";
import type { MenuItemsRouterType } from "~/server/api/routers/items";
// export type ItemType = {
//   id: number;
//   name: string;
//   description: string;
//   shortCode: string;
//   price: number;
//   imageUrl: string;
// };

// export const NullItem = {
//   id: 0,
//   name: "",
//   description: "",
//   shortCode: "",
//   price: 0,
//   imageUrl: "",
// };

//zod of ItemType

export type ItemRoutes = inferRouterOutputs<MenuItemsRouterType>;
// eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
export type ItemMutateProps = ItemRoutes["update"] | ItemRoutes["create"];

export const ItemSchemaValid = z.object({
  id: z
    .string()
    .refine((data) => data !== "", { message: "id is a required field" }),
  name: z
    .string()
    .refine((data) => data !== "", { message: "name is a required field" }),
  description: z.string().refine((data) => data !== "", {
    message: "description is a required field",
  }),
  shortCode: z
    .string()
    .max(8, "shortCode must be less than 8 characters")
    .refine((data) => data !== "", {
      message: "shortCode is a required field",
    }),
  price: z
    .number()
    .min(0, "price must be greater than or equal to 0")
    .refine((data) => !isNaN(data), { message: "price is a required field" }),
  imageUrl: z.string().optional().default("https://placehold.co/400"),
});

export const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  shortCode: z.string(),
  price: z.number(),
  imageUrl: z.string(),
});

export const ItemInputSchema = ItemSchema.omit({ id: true });

export const NullItem = Object.freeze(
  ItemSchema.parse({
    id: "0",
    name: "",
    description: "",
    shortCode: "",
    price: 0,
    imageUrl: "",
  })
);

export type ItemType = typeof NullItem;

export const MockItems: ItemType[] = [
  {
    id: "1",
    name: "Item 1",
    description: "Description 1",
    shortCode: "SC1",
    price: 10.99,
    imageUrl: "https://placehold.co/400",
  },
  {
    id: "2",
    name: "Item 2",
    description: "Description 2",
    shortCode: "SC2",
    price: 15.49,
    imageUrl: "https://placehold.co/400",
  },
  {
    id: "3",
    name: "Item 1",
    description: "Description 1",
    shortCode: "SC1",
    price: 10.99,
    imageUrl: "https://placehold.co/400",
  },
  {
    id: "4",
    name: "Item 2",
    description: "Description 2",
    shortCode: "SC2",
    price: 15.49,
    imageUrl: "https://placehold.co/400",
  },
  {
    id: "5",
    name: "Item 1",
    description: "Description 1",
    shortCode: "SC1",
    price: 10.99,
    imageUrl: "https://placehold.co/400",
  },
  {
    id: "6",
    name: "Item 2",
    description: "Description 2",
    shortCode: "SC2",
    price: 15.49,
    imageUrl: "https://placehold.co/400",
  },
  // Add more items as needed
];
