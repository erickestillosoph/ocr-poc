import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ImageFeature } from "./functions/image/imageFile.js";
import PDFFeature from "./functions/pdf/pdfFile.js";
import readline from "readline";

// This is a Node.js script, so we can use the fileURLToPath function to get the directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Promisify readline question
const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

// Example usage
async function main() {
  const exampleImagePath = path.resolve(__dirname, "images", "big_size.jpg");
  const examplePdfPath = path.resolve(__dirname, "pdf", "small_size.pdf");

  console.log("\nWelcome to the OCR Processing Tool!");
  console.log("----------------------------------");
  console.log("1. Process Image");
  console.log("2. Process PDF");

  const choice = await question("\nPlease choose an option (1 or 2): ");

  let output;

  switch (choice.trim()) {
    case "1":
      if (!fs.existsSync(exampleImagePath)) {
        console.log(
          `The test image does not exist at path: ${exampleImagePath}`
        );
        console.log(
          "You need to add a test receipt image to run this example."
        );
        break;
      }
      output = await ImageFeature.imageFeature(exampleImagePath);
      break;

    case "2":
      if (!fs.existsSync(examplePdfPath)) {
        console.log(`The test PDF does not exist at path: ${examplePdfPath}`);
        console.log("You need to add a test receipt PDF to run this example.");
        break;
      }
      output = await PDFFeature.pdfFeature(examplePdfPath);
      break;

    default:
      console.log("Invalid option selected. Please choose 1 or 2.");
      break;
  }

  if (output) {
    console.group("Output Details");
    console.log("Result:", JSON.stringify(output?.result, null, 2));
    console.log("Message ID:", output?.id);
    console.log("Message Role:", output?.role);
    console.log("Message Usage:", output?.usage);
    console.groupEnd();
  }

  rl.close();
}

try {
  main();
} catch (error) {
  console.error("Error in main:", error);
  rl.close();
}
