import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { LLMService } from "./services/llm.js";
import { RekognitionService } from "./services/rekognition.js";
import { ImageUtil } from "./utils/image.js";
import { createAIService } from "./factories/aiService.js";
import { z } from "zod";
import { IAIService } from "./types.js";

// This is a Node.js script, so we can use the fileURLToPath function to get the directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rekognitionService = new RekognitionService();

// Use the factory function to create the aiService instance
const aiService: IAIService = createAIService();

const llmService = new LLMService(aiService);

/**
 *
 * @param imageData
 * @param prompt
 * @param schema
 * @returns
 */
async function detectAndProcessImage<T>(
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
    return llmService.imageToJSON<T>(processedImage, prompt, schema);
  } catch (error) {
    console.error("Error detecting labels:", error);
  }
}

async function main() {
  // Example usage
  const exampleImagePath = path.resolve(__dirname, "images", "big_size.jpg");

  // Check if the example image exists
  if (!fs.existsSync(exampleImagePath)) {
    console.log(`The test image does not exist at path: ${exampleImagePath}`);
    console.log("You need to add a test receipt image to run this example.");
    console.log(
      "Please add a JPEG image named 'small_test_receipt.jpg' to the src/images directory."
    );
    return;
  }

  const exampleImageFileData = fs
    .readFileSync(exampleImagePath)
    .toString("base64");

  // example grocery store receipt prompt
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
  // example schema, for our grocery store receipt:
  const ExampleGroceryStoreReceiptSchema = z.object({
    items: z.array(
      z
        .object({
          name: z.string(),
          price: z.string(), // Changed from z.number() to accept string prices
          related_data: z.array(z.string()),
        })
        .required()
    ),
  });

  // pass example image data, prompt, and schema to the detectAndProcessImage function
  const output = await detectAndProcessImage<
    z.infer<typeof ExampleGroceryStoreReceiptSchema>
  >(
    exampleImageFileData,
    exampleGroceryPrompt,
    ExampleGroceryStoreReceiptSchema
  );

  console.group("Output Details");
  console.log("Result:", JSON.stringify(output?.result, null, 2));
  console.log("Message ID:", output?.id);
  console.log("Message Role:", output?.role);
  console.log("Message Usage:", output?.usage);
  console.groupEnd();
}

try {
  main();
} catch (error) {
  console.error("Error in main:", error);
}
