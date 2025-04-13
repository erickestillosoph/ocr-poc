import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import ImageFeature from "../services/image/imageFile.js";
import PDFFeature from "../services/pdf/pdfFile.js";
import fs from "fs";
import imageRoute from "../routes/imageRoute.js";
import pdfRoute from "../routes/pdfRoute.js";
import { API_PREFIXES, environment, API_KEY } from "../config/api-config.js";

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

// Configure CORS - make more permissive and explicitly allow x-api-key header
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key", "x-api-key"],
    exposedHeaders: ["X-API-Key", "x-api-key"],
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
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key", "x-api-key"],
    exposedHeaders: ["X-API-Key", "x-api-key"],
    credentials: true,
  })
);

// Add security headers including CSP
app.use((req, res, next) => {
  // Set CSP header to allow Vercel scripts and more connections
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live *.vercel.app vercel.app; connect-src 'self' https://vercel.live *.vercel.app; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-src 'self';"
  );
  next();
});

// Simple API key authentication for protected routes
// Check if the request path includes 'process-' and requires authentication
app.use((req, res, next) => {
  // Skip auth for non-protected routes
  if (!req.path.includes("process-")) {
    return next();
  }

  // Get API key from multiple possible sources:
  // 1. Header: x-api-key
  // 2. Header: X-API-Key (different case)
  // 3. Query parameter: apiKey
  // 4. Query parameter: api_key
  // 5. Body parameter for POST requests
  const apiKey =
    req.headers["x-api-key"] ||
    req.headers["X-API-Key"] ||
    req.query.apiKey ||
    req.query.api_key ||
    (req.body && req.body.apiKey);

  // For development, allow requests without API key
  if (environment === "local" && !apiKey) {
    console.log("Development mode: Bypassing API key check");
    return next();
  }

  // Check if API key is valid
  if (apiKey !== API_KEY) {
    console.log(`Invalid API key: ${apiKey}`);
    return res.status(401).json({ error: "Unauthorized. Invalid API key." });
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
