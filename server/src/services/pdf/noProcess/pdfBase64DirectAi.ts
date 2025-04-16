import { createAIService } from "../../../factories/aiService.js";
import { LLMService } from "../../llm.js";
import { IAIService } from "../../../types/types.js";
import { simplePdfPrompt } from "../../../utils/prompts.js";
const aiService: IAIService = createAIService();

const llmService = new LLMService(aiService);

export class PDFFeatureBase64DirectAi {
  /**
   *
   * @param areaOfInterest
   * @param fileBase64
   * @returns
   */
  static async base64DirectAi(fileBase64: string) {
    const pdfBase64 = fileBase64.toString().split(",")[1];

    const output = llmService.pdfToJSON(pdfBase64, simplePdfPrompt);

    return output;
  }
}
export default PDFFeatureBase64DirectAi;
