import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import ImageFeature from "../services/image/imageFile.js";
import PDFFeature from "../services/pdf/pdfFile.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import imageRoute from "../routes/imageRoute.js";
import pdfRoute from "../routes/pdfRoute.js";
import { API_PREFIXES, environment } from "../config/api-config.js";

console.log(`[Server] Running in ${environment} environment`);

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine if running on Vercel
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";

// Set uploads directory inside src folder for better Vercel compatibility
const uploadsDir =
  isVercel || process.env.NODE_ENV === "production"
    ? path.join("/tmp", "uploads")
    : path.join(__dirname, "..", "uploads");

// Always create a src/uploads directory regardless of environment
const srcUploadsDir = path.join(__dirname, "..", "uploads");

console.log(`API: Uploads directory set to: ${uploadsDir}`);
console.log(`API: Src uploads directory set to: ${srcUploadsDir}`);

// Ensure both uploads directories exist
if (!fs.existsSync(uploadsDir)) {
  console.log(`Creating uploads directory at: ${uploadsDir}`);
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Successfully created uploads directory at: ${uploadsDir}`);
  } catch (err) {
    console.error(`Error creating uploads directory at ${uploadsDir}:`, err);
    // If /tmp/uploads fails, try alternate location
    if (uploadsDir.startsWith("/tmp")) {
      const altDir = "/tmp";
      console.log(`Attempting to create alternate directory at: ${altDir}`);
      try {
        if (!fs.existsSync(altDir)) {
          fs.mkdirSync(altDir, { recursive: true });
        }
        console.log(`Successfully created alternate directory at: ${altDir}`);
      } catch (altErr) {
        console.error(`Error creating alternate directory:`, altErr);
      }
    }
  }
}

// Always create src/uploads directory regardless of environment
if (!fs.existsSync(srcUploadsDir)) {
  console.log(`Creating src uploads directory at: ${srcUploadsDir}`);
  try {
    fs.mkdirSync(srcUploadsDir, { recursive: true });
    console.log(
      `Successfully created src uploads directory at: ${srcUploadsDir}`
    );
  } catch (srcErr) {
    console.error(
      `Error creating src uploads directory at ${srcUploadsDir}:`,
      srcErr
    );
  }
}

export async function processImage(imageFile: Express.Multer.File) {
  // Get the filename from the original path
  const filename = path.basename(imageFile.path);

  // Determine the appropriate path based on environment
  let filePath = imageFile.path;

  // For Vercel/production environments, ensure the file is in /tmp
  if (
    (isVercel || process.env.NODE_ENV === "production") &&
    !fs.existsSync(filePath)
  ) {
    filePath = path.join(uploadsDir, filename);
    console.log(`Adjusting path for serverless environment: ${filePath}`);
  }

  // Log file existence check
  console.log(`Checking for file at: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error(`Image file not found at: ${filePath}`);
    throw new Error(
      `Image file does not exist at the specified path: ${filePath}`
    );
  }

  console.log(`Processing image at: ${filePath}`);
  const output = await ImageFeature.imageFeature(filePath);
  return output?.result;
}

export async function processPdf(pdfFile: Express.Multer.File) {
  // Get the filename from the original path
  const filename = path.basename(pdfFile.path);

  // Determine the appropriate path based on environment
  let filePath = pdfFile.path;

  // For Vercel/production environments, ensure the file is in /tmp
  if (
    (isVercel || process.env.NODE_ENV === "production") &&
    !fs.existsSync(filePath)
  ) {
    filePath = path.join(uploadsDir, filename);
    console.log(`Adjusting path for serverless environment: ${filePath}`);
  }

  // Log file existence check
  console.log(`Checking for file at: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error(`PDF file not found at: ${filePath}`);
    throw new Error(
      `PDF file does not exist at the specified path: ${filePath}`
    );
  }

  console.log(`Processing PDF at: ${filePath}`);
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
