import { z } from "zod";

export const ExampleGroceryStoreReceiptSchema = z.object({
  items: z.array(
    z
      .object({
        name: z.string(),
        price: z.string(), // Changed from z.number() to accept string prices
        related_data: z.array(z.string()),
      })
      .required()
  ),
});
