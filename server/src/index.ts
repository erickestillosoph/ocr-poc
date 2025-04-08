import express from "express";
import fs from "fs";
import { LLMService } from "./services/llm.js";
import { RekognitionService } from "./services/rekognition.js";
import { ImageUtil } from "./utils/image.js";
import { createAIService } from "./factories/aiService.js";
import { z } from "zod";
import { IAIService } from "./types.js";
import imageRoute from "./routes/imageRoute";

// This is a Node.js script, so we can use the fileURLToPath function to get the directory name
// const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rekognitionService = new RekognitionService();
const aiService: IAIService = createAIService();
const llmService = new LLMService(aiService);

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

// Example schema for the grocery store receipt
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

// Function that returns the result from main
export async function processImage(imageFile: Express.Multer.File) {
  // const exampleImagePath = path.resolve(__dirname, "images", "big_size.jpg");

  if (!fs.existsSync(imageFile.path)) {
    throw new Error("The test image does not exist at the specified path.");
  }

  const imageBuffer = fs.readFileSync(imageFile.path);

  const exampleImageFileData = imageBuffer.toString("base64");

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

  const output = await detectAndProcessImage<
    z.infer<typeof ExampleGroceryStoreReceiptSchema>
  >(
    exampleImageFileData,
    exampleGroceryPrompt,
    ExampleGroceryStoreReceiptSchema
  );

  return output?.result;
}

// Initialize Express
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// ImageRoute
app.use(imageRoute);

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
