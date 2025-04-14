import { createAIService } from "../../factories/aiService.js";
import { LLMService } from "../llm.js";
import { IAIService } from "../../types/types.js";
import { z } from "zod";
import { ExampleGroceryStoreReceiptSchema } from "../image/cameraImageSchema.js";

const aiService: IAIService = createAIService();

const llmService = new LLMService(aiService);

export class ImageFeature {
  /**
   *
   * @param areaOfInterest
   * @param pdfBuffer
   * @returns
   */
  static async cameraImageFeature(cameraImageStringBase64: string) {
    const exampleGroceryPrompt =
      "SYSTEM: You are a receipt parser that ONLY outputs valid JSON.  If you cannot parse the receipt completely, still return a valid JSON with the fields you can identify.\n\n" +
      "[STRICT JSON ONLY RESPONSE REQUIRED] " +
      "IMPORTANT: Parse this receipt and output a JSON object containing ALL items found. " +
      "IMPORTANT: Each distinct price or charge should be a separate item in the array. " +
      "IMPORTANT: Your response must ONLY be a valid JSON object with no additional explanations or text.\n" +
      "Please add all data on every line to the results array to the key of all_datas. " +
      "IMPORTANT: You're an expert in parsing receipts. Parse this receipt and output a JSON object containing ALL items found. Count the number of items or receipts. " +
      "Please don't miss any items. Please don't merge items. Please don't summarize items. Please don't skip any items. " +
      "Items are individual product/service line items on the receipt with their own prices, as well as any applicable taxes, subtotals, or fees. " +
      "Language is in Japanese. Please understand the context in Japanese. " +
      "If it's confusing please convert to English. " +
      "Read every line of the receipt and output a JSON object containing BOTH receipt metadata AND all individual line items found. " +
      "Receipt metadata includes: company name (領収書番号), date (日付), address (宛名), amount (金額), issuer name (発行事業者名), qualified bill issuer registration number (適格請求書発行事業者 登録番号). " +
      "Line items include: product/service name, quantity, unit price, and total price for each individual item purchased. " +
      "IMPORTANT: Include EVERY SINGLE item and transaction found on the receipt. " +
      "IMPORTANT: Please follow the schema below EXACTLY. No deviation is allowed: " +
      'results: [{"id": string, "label": string, "count": string, "receipt_metadata": {"company_name": string, "receipt_number": string, "date": string, "address": string, "total_amount": string, "issuer_name": string, "bill_issuer_registration_number": string}, "items": Array<{"name": string, "quantity": string, "unit_price": string, "price": string}>, {"all_datas": Array<string>} ' +
      "IMPORTANT: Please don't miss any items. " +
      "IMPORTANT: Please don't merge items. " +
      "IMPORTANT: Please don't summarize items. " +
      "IMPORTANT: Please don't skip any items. " +
      "IMPORTANT: If found multiple items, include them as separate items. " +
      "IMPORTANT: If found multiple receipts or images, include them as separate result. " +
      "DO NOT include any natural language before or after the schema JSON. " +
      "DO NOT explain what you found. " +
      "DO NOT wrap the JSON in backticks. " +
      "Example of valid response: " +
      'results: [{"id": "1", "label": "駐車料金", "count": "1", "receipt_metadata": {"company_name": "タイムズ24株式会社", "receipt_number": "0120-72-8924", "date": "2024年12月16日", "address": "タイムズ利用者", "total_amount": "1,320円", "issuer_name": "タイムズ24株式会社", "bill_issuer_registration_number": "T1000001013724"}, ' +
      '"items": [{"name": "駐車料金", "quantity": "1", "unit_price": "400円", "price": "400円"}, {"name": "消費税", "quantity": "1", "unit_price": "40円", "price": "40円"}], ' +
      '"all_datas": ["駐車料金", "消費税"]}]}' +
      "\n\nYou MUST respond with ONLY the JSON object, nothing else. NEVER provide explanations or descriptions. ONLY JSON.";

    const output = llmService.cameraImageToJSON<
      z.infer<typeof ExampleGroceryStoreReceiptSchema>
    >(
      cameraImageStringBase64,
      exampleGroceryPrompt,
      ExampleGroceryStoreReceiptSchema
    );
    return output;
  }
}
export default ImageFeature;
