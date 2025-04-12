import { z } from "zod";
import detectAndProcessImage from "./detectAndProcessImage.js";
import { ExampleGroceryStoreReceiptSchema } from "./imageSchema.js";

export class ImageOutputResult {
  static async detectAndProcessImage<T>(
    imageFileData: string,
    imagePrompt: string
  ) {
    const output = await detectAndProcessImage<
      z.infer<typeof ExampleGroceryStoreReceiptSchema>
    >(imageFileData, imagePrompt, ExampleGroceryStoreReceiptSchema);
    return output;
  }
}
export default ImageOutputResult;
