import { createAIService } from "../../factories/aiService.js";
import { LLMService } from "../llm.js";
import { IAIService } from "../../types/types.js";
import { ExmaplePdfSchema } from "./pdfSchema.js";
import { z } from "zod";
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

    const output = llmService.pdfToJSON<z.infer<typeof ExmaplePdfSchema>>(
      pdfBase64,
      complexPdfPrompt,
      ExmaplePdfSchema
    );

    return output;
  }
}
export default PDFFeature;
