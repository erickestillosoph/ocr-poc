import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { processPdf } from "../api/index.js";
import {
  API_PREFIXES,
  environment,
  baseApiVersion,
} from "../config/api-config.js";

console.log(`Server running in ${environment} environment`);

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine if running on Vercel
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";

// Set uploads directory inside src for better Vercel compatibility
const uploadsDir =
  isVercel || process.env.NODE_ENV === "production"
    ? path.join("/tmp", "uploads")
    : path.join(__dirname, "..", "uploads");

// Only use src/uploads in development environment
const srcUploadsDir =
  isVercel || process.env.NODE_ENV === "production"
    ? null // Don't use src/uploads in production/Vercel
    : path.join(__dirname, "..", "uploads");

console.log(`PDF route: Uploads directory set to: ${uploadsDir}`);
if (srcUploadsDir) {
  console.log(`PDF route: Src uploads directory set to: ${srcUploadsDir}`);
}

// Create directories
try {
  // Create main uploads directory
  if (!fs.existsSync(uploadsDir)) {
    console.log(`Creating uploads directory at: ${uploadsDir}`);
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Successfully created uploads directory at: ${uploadsDir}`);
  }

  // Only create src/uploads in dev environment
  if (srcUploadsDir && !isVercel && process.env.NODE_ENV !== "production") {
    console.log(`Creating src uploads directory at: ${srcUploadsDir}`);
    fs.mkdirSync(srcUploadsDir, { recursive: true });
    console.log(
      `Successfully created src uploads directory at: ${srcUploadsDir}`
    );
  }
} catch (err) {
  console.error("Error creating uploads directory:", err);
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Double-check the directory exists when handling the upload
    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      cb(null, uploadsDir);
    } catch (err) {
      // Fallback to /tmp if the main directory fails
      console.error(
        `Error accessing upload directory, falling back to /tmp:`,
        err
      );
      cb(null, "/tmp");
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

const router = Router();

// Create routes for each API prefix
API_PREFIXES.forEach((prefix) => {
  // Add GET handler for testing and debugging
  router.get(`${prefix}/process-pdf`, (req, res) => {
    res.json({
      status: "ready",
      message:
        "PDF processing endpoint is available. Please send a POST request with an pdf file.",
      environment,
      timestamp: new Date().toISOString(),
    });
  });

  router.post(
    `${prefix}/process-pdf`,
    upload.single("pdf"),
    async (req, res) => {
      try {
        const pdfFile = req.file as Express.Multer.File;
        if (!pdfFile) {
          return res.status(400).json({ error: "No PDF file provided" });
        }

        // Set a longer timeout for the response
        res.setTimeout(30000, () => {
          console.log("Response timeout reached");
          // This will only execute if the response hasn't been sent yet
          if (!res.headersSent) {
            res.status(504).json({
              error: "Gateway timeout",
              message:
                "The request is taking too long to process. Please try with a smaller or less complex PDF.",
            });
          }
        });

        const result = await processPdf(pdfFile);
        res.json({
          result,
          environment,
        });
      } catch (error) {
        console.error("Error in processing PDF:", error);
        // Check if headers were already sent
        if (!res.headersSent) {
          // Handle timeout error specifically
          if ((error as Error).message.includes("timeout")) {
            return res.status(504).json({
              error: "Gateway timeout",
              message:
                "The request is taking too long to process. Please try with a smaller or less complex PDF.",
            });
          }

          // Handle other errors
          res.status(500).json({
            error: "Failed to process the PDF",
            message: (error as Error).message || "Unknown error",
          });
        }
      }
    }
  );
});

router.get(`${baseApiVersion}/process-pdf`, (req, res) => {
  res.json({
    status: "ready",
    message:
      "PDF processing endpoint is available. Please send a POST request with an pdf file.",
    environment,
    timestamp: new Date().toISOString(),
  });
});

router.post(
  `${baseApiVersion}/process-pdf`,
  upload.single("pdf"),
  async (req, res) => {
    try {
      const pdfFile = req.file as Express.Multer.File;
      if (!pdfFile) {
        return res.status(400).json({ error: "No PDF file provided" });
      }

      // Set a longer timeout for the response
      res.setTimeout(30000, () => {
        console.log("Response timeout reached");
        // This will only execute if the response hasn't been sent yet
        if (!res.headersSent) {
          res.status(504).json({
            error: "Gateway timeout",
            message:
              "The request is taking too long to process. Please try with a smaller or less complex PDF.",
          });
        }
      });

      const result = await processPdf(pdfFile);
      res.json({
        result,
        environment,
      });
    } catch (error) {
      console.error("Error in processing PDF:", error);
      // Check if headers were already sent
      if (!res.headersSent) {
        // Handle timeout error specifically
        if ((error as Error).message.includes("timeout")) {
          return res.status(504).json({
            error: "Gateway timeout",
            message:
              "The request is taking too long to process. Please try with a smaller or less complex PDF.",
          });
        }

        // Handle other errors
        res.status(500).json({
          error: "Failed to process the PDF",
          message: (error as Error).message || "Unknown error",
        });
      }
    }
  }
);

export default router;
