import { createAIService } from "../../factories/aiService.js";
import { LLMService } from "../llm.js";
import { IAIService } from "../../types.js";
import { ExmaplePdfSchema } from "./pdfSchema.js";
import { z } from "zod";
import { PdfUtil } from "../../utils/document.js";
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

    const exampleGroceryPrompt =
      "[STRICT JSON ONLY RESPONSE REQUIRED] " +
      "Parse this receipt and output a JSON object containing ALL items found. " +
      "Return a JSON object matching this exact schema, with no additional text or explanation: " +
      '{"items": Array<{name: string, price: string, related_data: string[]}>}. ' +
      "IMPORTANT: Include EVERY SINGLE item and transaction found on the receipt. " +
      "Each distinct price or charge should be a separate item in the array. " +
      "For duplicate company names, include them as separate items if they have different prices. " +
      "Your entire response must be parseable by JSON.parse() with no modifications. " +
      "DO NOT include any natural language before or after the JSON. " +
      "DO NOT explain what you found. " +
      "DO NOT wrap the JSON in backticks. " +
      "Example of valid response: " +
      '{"items":[{"name":"Milk","price":"3.99","related_data":["1L","Organic"]},{"name":"Bread","price":"2.99","related_data":["Wheat","500g"]}]}';

    const output = llmService.pdfToJSON<z.infer<typeof ExmaplePdfSchema>>(
      pdfBase64,
      exampleGroceryPrompt,
      ExmaplePdfSchema
    );

    return output;
  }
}
export default PDFFeature;
