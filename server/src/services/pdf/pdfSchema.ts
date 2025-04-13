import { z } from "zod";

export const ExmaplePdfSchema = z.object({
  items: z.array(
    z
      .object({
        name: z.string(),
        price: z.string(),
        related_data: z.array(z.string()),
      })
      .required()
  ),
});
