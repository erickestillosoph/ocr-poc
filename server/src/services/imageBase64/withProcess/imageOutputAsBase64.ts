import { z } from "zod";
import processFileBase64 from "./processFileBase64.js";
import { ExampleGroceryStoreReceiptSchema } from "../imageSchema.js";

export class ImageOutputResultAsBase64 {
  static async detectAndProcessImageAsBase64<T>(
    imageFileData: string,
    imagePrompt: string
  ) {
    const output = await processFileBase64<
      z.infer<typeof ExampleGroceryStoreReceiptSchema>
    >(imageFileData, imagePrompt, ExampleGroceryStoreReceiptSchema);
    return output;
  }
}
export default ImageOutputResultAsBase64;
