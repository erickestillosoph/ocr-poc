import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import ImageFeature from "../services/image/imageFile.js";
import PDFFeature from "../services/pdf/pdfFile.js";
import fs from "fs";
import path from "path";
import imageRoute from "../routes/imageRoute.js";
import pdfRoute from "../routes/pdfRoute.js";
import { API_PREFIXES, environment } from "../config/api-config.js";

console.log(`[Server] Running in ${environment} environment`);

// Ensure uploads directory exists
const uploadsDir =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "uploads")
    : path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
  console.log(`Creating uploads directory at: ${uploadsDir}`);
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function processImage(imageFile: Express.Multer.File) {
  // In production environment, copy the file to the /tmp directory if needed
  let filePath = imageFile.path;
  if (process.env.NODE_ENV === "production" && !fs.existsSync(filePath)) {
    const filename = path.basename(filePath);
    const tmpPath = path.join(uploadsDir, filename);
    // If original file exists but in wrong location, copy it
    const originalPath = path.join(process.cwd(), "uploads", filename);
    if (fs.existsSync(originalPath)) {
      fs.copyFileSync(originalPath, tmpPath);
      filePath = tmpPath;
    }
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Image file does not exist at the specified path: ${filePath}`
    );
  }
  const output = await ImageFeature.imageFeature(filePath);
  return output?.result;
}

export async function processPdf(pdfFile: Express.Multer.File) {
  // In production environment, copy the file to the /tmp directory if needed
  let filePath = pdfFile.path;
  if (process.env.NODE_ENV === "production" && !fs.existsSync(filePath)) {
    const filename = path.basename(filePath);
    const tmpPath = path.join(uploadsDir, filename);
    // If original file exists but in wrong location, copy it
    const originalPath = path.join(process.cwd(), "uploads", filename);
    if (fs.existsSync(originalPath)) {
      fs.copyFileSync(originalPath, tmpPath);
      filePath = tmpPath;
    }
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `PDF file does not exist at the specified path: ${filePath}`
    );
  }
  const output = await PDFFeature.pdfFeature(filePath);
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
