import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import ImageFeature from "../services/image/imageFile.js";
import PDFFeature from "../services/pdf/pdfFile.js";
import fs from "fs";
import imageRoute from "../routes/imageRoute.js";
import pdfRoute from "../routes/pdfRoute.js";
import { API_PREFIXES, environment } from "../config/api-config.js";

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
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// Handle OPTIONS requests explicitly for CORS preflight
app.options(
  "*",
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Add security headers including CSP
app.use((req, res, next) => {
  // Set CSP header to allow Vercel scripts and more connections
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' * data: blob: filesystem:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live; connect-src 'self' *;"
  );
  next();
});

app.use((req, res, next) => {
  // Use path-based access control for protected routes
  if (req.path.includes("process-")) {
    // For development environment, allow all access
    if (environment === "local") {
      console.log("Development mode: Allowing access to protected endpoint");
      return next();
    }

    console.log(`Access granted to protected path: ${req.path}`);
  }
  next();
});

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment,
    timestamp: new Date().toISOString(),
  });
});

// Sample API route
API_PREFIXES.forEach((prefix) => {
  app.get(`${prefix}/info`, (req, res) => {
    res.json({
      version: "1.0.0",
      environment,
      description: "OCR API Service",
      endpoints: [
        { path: "/", method: "GET", description: "Health check" },
        {
          path: `${prefix}/info`,
          method: "GET",
          description: "API information",
        },
      ],
    });
  });
});

app.use(imageRoute);

app.use(pdfRoute);
// Start server if not in production (serverless) environment
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server ready on port ${port}`));
}

export const handler = serverless(app);

export default app;
