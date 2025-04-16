import { createAIService } from "../../../factories/aiService.js";
import { LLMService } from "../../llm.js";
import { RekognitionService } from "../../rekognition.js";

import { ImageUtil } from "../../../utils/file.js";
import { z } from "zod";
import { IAIService } from "../../../types/types.js";

const aiService: IAIService = createAIService();
const rekognitionService = new RekognitionService();
const llmService = new LLMService(aiService);

/**
 *
 * @param imageData
 * @param prompt
 * @param schema
 * @returns
 */
async function processFileBase64<T>(
  imageData: string,
  prompt: string,
  schema: z.ZodType<T>
) {
  try {
    const imageBuffer = Buffer.from(imageData, "base64");
    const areaOfInterest = await rekognitionService.findTextAreaOfInterest(
      imageBuffer
    );
    const processedImage = await ImageUtil.extractAndProcessImage(
      areaOfInterest,
      imageBuffer
    );
    return llmService.base64FileToJSON<T>(processedImage, prompt, schema);
  } catch (error) {
    console.error("Error detecting labels:", error);
  }
}
export default processFileBase64;
