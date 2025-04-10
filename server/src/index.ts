import express from "express";
import fs from "fs";
import cors from "cors";
import imageRoute from "./routes/imageRoute";
import pdfRoute from "./routes/pdfRoute";
import ImageFeature from "./functions/image/imageFile.js";
import PDFFeature from "./functions/pdf/pdfFile.js";

// Function that returns the result from main
export async function processImage(imageFile: Express.Multer.File) {
  if (!fs.existsSync(imageFile.path)) {
    throw new Error("The test image does not exist at the specified path.");
  }
  const output = await ImageFeature.imageFeature(imageFile.path);
  return output?.result;
}

export async function processPdf(pdfFile: Express.Multer.File) {
  if (!fs.existsSync(pdfFile.path)) {
    throw new Error("The test pdf does not exist at the specified path.");
  }
  const output = await PDFFeature.pdfFeature(pdfFile.path);
  return output?.result;
}

const app = express();

app.use(cors());

app.use(express.json());

// ImageRoute
app.use(imageRoute);

// PdfRoute
app.use(pdfRoute);

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
