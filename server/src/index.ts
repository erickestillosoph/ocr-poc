import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import ImageFeature from "./functions/image/imageFile.js";
import PDFFeature from "./functions/pdf/pdfFile.js";
import fs from "fs";
import imageRoute from "./routes/imageRoute.js";
import pdfRoute from "./routes/pdfRoute.js";
// Define environment
const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";
const environment = isProduction ? "production" : "local";

console.log(`[Server] Running in ${environment} environment`);

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

// Create Express app
const app = express();

// Configure CORS
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment,
    timestamp: new Date().toISOString(),
  });
});

// Sample API route
app.get("/api/info", (req, res) => {
  res.json({
    version: "1.0.0",
    environment,
    description: "OCR API Service",
    endpoints: [
      { path: "/", method: "GET", description: "Health check" },
      { path: "/api/info", method: "GET", description: "API information" },
    ],
  });
});

app.use(imageRoute);

app.use(pdfRoute);
// Start server if not in production (serverless) environment
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server ready on port ${port}`));
}

// Export the serverless handler
export const handler = serverless(app);

// Default export
export default app;
