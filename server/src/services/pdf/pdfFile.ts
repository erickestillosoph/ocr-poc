import { createAIService } from "../../factories/aiService.js";
import { LLMService } from "../llm.js";
import { IAIService } from "../../types/types.js";
import { PdfUtil } from "../../utils/document.js";
import { complexPdfPrompt } from "../../utils/prompts.js";
const aiService: IAIService = createAIService();

const llmService = new LLMService(aiService);

export class PDFFeature {
  /**
   *
   * @param areaOfInterest
   * @param pdfBuffer
   * @returns
   */
  static async pdfFeature(pdfPath: string) {
    const pdfBase64 = await PdfUtil.documentToBase64(pdfPath);

    const output = llmService.pdfToJSON(pdfBase64, complexPdfPrompt);

    return output;
  }
}
export default PDFFeature;
