import express from "express";
import fs from "fs";
import cors from "cors";
import imageRoute from "./routes/imageRoute";
import pdfRoute from "./routes/pdfRoute";
import ImageFeature from "./functions/image/imageFile.js";
import PDFFeature from "./functions/pdf/pdfFile.js";
import serverless from "serverless-http";

// Log environment from route files
import { environment } from "./routes/imageRoute";
console.log(`[Server] Running in ${environment} environment`);

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

// Configure CORS to allow requests from any origin
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Add environment info to response locals
app.use((req, res, next) => {
  res.locals.environment = environment;
  next();
});

// ImageRoute
app.use(imageRoute);

// PdfRoute
app.use(pdfRoute);

// Add root route
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

// Start server if not in production (serverless) environment
if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => console.log("Server ready on port 3000."));
}

export default app;
export const handler = serverless(app);
