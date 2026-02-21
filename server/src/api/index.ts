import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import ImageFeatureAsBase64 from "../services/imageBase64/withProcess/imageFileAsBase64.js";
import PDFFeature from "../services/pdf/pdfFile.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { API_PREFIXES, environment } from "../config/api-config.js";
import {
  uploadsDir,
  initializeUploadDirectories,
} from "../config/upload-config.js";
import imagePathApi from "../routes/imagePathApi.js";
import pdfPathApi from "../routes/pdfPathApi.js";
import ImageFeatureBase64DirectAi from "../services/imageBase64/noProcess/imageBase64DirectAi.js";
import PDFFeatureBase64DirectAi from "../services/pdf/noProcess/pdfBase64DirectAi.js";
// Add timeout configuration
const PROCESS_TIMEOUT = 20000;

console.log(`[Server] Running in ${environment} environment`);

// Initialize upload directories with API prefix
initializeUploadDirectories("API: ");

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine if running on Vercel
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";

export async function processImage(imageFile: Express.Multer.File) {
  const filename = path.basename(imageFile.path);

  let filePath = imageFile.path;

  // For Vercel/production environments, ensure the file is in /tmp
  if (
    (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") &&
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

  // Add timeout to prevent gateway timeouts
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Processing timeout exceeded"));
    }, PROCESS_TIMEOUT);
  });

  try {
    const result = (await Promise.race([
      ImageFeatureAsBase64.imageFeature(filePath),
      timeoutPromise,
    ])) as { result?: any } | undefined;
    return result?.result;
  } catch (error) {
    if ((error as Error).message === "Processing timeout exceeded") {
      console.error("Image processing timeout exceeded");
      throw new Error(
        "Processing timeout. The request is taking too long to complete."
      );
    }
    throw error;
  }
}

export async function processImagePathBase64(imagePathBase64: string) {
  if (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") {
    console.log(
      `Adjusting path for serverless environment: ${imagePathBase64}`
    );
  }

  try {
    const result = (await Promise.race([
      ImageFeatureBase64DirectAi.imageBase64DirectAi(imagePathBase64),
    ])) as { result?: any } | undefined;
    return result?.result;
  } catch (error) {
    if (error as Error) {
      console.error(error);
      throw new Error(`${error}`);
    }
    throw error;
  }
}

export async function processPDFPathBase64(pdfPathBase64: string) {
  if (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") {
    console.log(`Adjusting path for serverless environment: ${pdfPathBase64}`);
  }

  try {
    const result = (await Promise.race([
      PDFFeatureBase64DirectAi.base64DirectAi(pdfPathBase64),
    ])) as { result?: any } | undefined;
    return result?.result;
  } catch (error) {
    if (error as Error) {
      console.error(error);
      throw new Error(`${error}`);
    }
    throw error;
  }
}

export async function processPdf(pdfFile: Express.Multer.File) {
  // Get the filename from the original path
  const filename = path.basename(pdfFile.path);

  // Determine the appropriate path based on environment
  let filePath = pdfFile.path;

  // For Vercel/production environments, ensure the file is in /tmp
  if (
    (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") &&
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

  // Add timeout to prevent gateway timeouts
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Processing timeout exceeded"));
    }, PROCESS_TIMEOUT);
  });

  try {
    // Race the processing against the timeout
    const result = (await Promise.race([
      PDFFeature.pdfFeature(filePath),
      timeoutPromise,
    ])) as { result?: any } | undefined;
    return result?.result;
  } catch (error) {
    if ((error as Error).message === "Processing timeout exceeded") {
      console.error("PDF processing timeout exceeded");
      throw new Error(
        "Processing timeout. The request is taking too long to complete."
      );
    }
    throw error;
  }
}

// Create Express app
const app = express();

// Configure CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);

      // Define allowed origins
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        process.env.FRONTEND_URL_PROD,
      ].filter(Boolean);

      // For development, allow all origins if no specific origins are set
      if (allowedOrigins.length === 0 && environment === "local") {
        return callback(null, true);
      }

      // Check if the origin is allowed
      if (allowedOrigins.indexOf(origin) !== -1 || environment === "local") {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
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
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);

      // Define allowed origins
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        process.env.FRONTEND_URL_PROD,
      ].filter(Boolean);

      // For development, allow all origins if no specific origins are set
      if (allowedOrigins.length === 0 && environment === "local") {
        return callback(null, true);
      }

      // Check if the origin is allowed
      if (allowedOrigins.indexOf(origin) !== -1 || environment === "local") {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
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

  // Add CORS debug header to help identify allowed origins
  res.setHeader(
    "X-CORS-Debug",
    `Allowed origins: ${process.env.FRONTEND_URL}, ${process.env.FRONTEND_URL_PROD}`
  );

  next();
});

app.use((req, res, next) => {
  if (req.path.includes("process-")) {
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

app.use(imagePathApi);
app.use(pdfPathApi);
// Start server if not in production (serverless) environment
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server ready on port ${port}`));
}

export const handler = serverless(app);

export default app;
