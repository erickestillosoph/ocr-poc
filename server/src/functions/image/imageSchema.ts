import { z } from "zod";

export const ExampleGroceryStoreReceiptSchema = z.object({
  results: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      count: z.string(),
      receipt_metadata: z.object({
        company_name: z.string(),
        receipt_number: z.string(),
        date: z.string(),
        address: z.string(),
        total_amount: z.string(),
        issuer_name: z.string(),
        bill_issuer_registration_number: z.string(),
      }),
      items: z.array(
        z.object({
          name: z.string(),
          quantity: z.string(),
          unit_price: z.string(),
          price: z.string(),
        })
      ),
      all_datas: z.array(z.string()),
    })
  ),
});
