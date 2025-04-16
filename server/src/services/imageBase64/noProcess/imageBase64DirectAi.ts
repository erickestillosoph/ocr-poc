import { createAIService } from "../../../factories/aiService.js";
import { LLMService } from "../../llm.js";
import { IAIService } from "../../../types/types.js";
import { ExampleGroceryStoreReceiptSchema } from "../imageSchema.js";
import { z } from "zod";
import { simpleImagePrompt } from "../../../utils/prompts.js";
const aiService: IAIService = createAIService();

const llmService = new LLMService(aiService);

export class ImageFeatureBase64DirectAi {
  /**
   *
   * @param areaOfInterest
   * @param fileBase64
   * @returns
   */
  static async imageBase64DirectAi(fileBase64: string) {
    const imagePathBase64 = fileBase64.toString().split(",")[1];

    const output = llmService.base64FileToJSON<
      z.infer<typeof ExampleGroceryStoreReceiptSchema>
    >(imagePathBase64, simpleImagePrompt, ExampleGroceryStoreReceiptSchema);

    return output;
  }
}
export default ImageFeatureBase64DirectAi;
