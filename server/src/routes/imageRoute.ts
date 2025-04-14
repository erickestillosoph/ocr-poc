import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { processImage } from "../api/index.js";
import {
  API_PREFIXES,
  environment,
  baseApiVersion,
} from "../config/api-config.js";

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine if running on Vercel
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";

const uploadsDir =
  isVercel || process.env.NODE_ENV === "production"
    ? path.join("/tmp", "uploads")
    : path.join(__dirname, "..", "uploads");

const srcUploadsDir = path.join(__dirname, "..", "uploads");

console.log(`Image route: Uploads directory set to: ${uploadsDir}`);
console.log(`Image route: Src uploads directory set to: ${srcUploadsDir}`);

try {
  if (!fs.existsSync(uploadsDir)) {
    console.log(`Creating uploads directory at: ${uploadsDir}`);
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Successfully created uploads directory at: ${uploadsDir}`);
  }

  if (!fs.existsSync(srcUploadsDir)) {
    console.log(`Creating src uploads directory at: ${srcUploadsDir}`);
    fs.mkdirSync(srcUploadsDir, { recursive: true });
    console.log(
      `Successfully created src uploads directory at: ${srcUploadsDir}`
    );
  }
} catch (err) {
  console.error("Error creating uploads directory:", err);

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
    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      cb(null, uploadsDir);
    } catch (err) {
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
  router.get(`${prefix}/process-image`, (req, res) => {
    res.json({
      status: "ready",
      message:
        "Image processing endpoint is available. Please send a POST request with an image file.",
      environment,
      timestamp: new Date().toISOString(),
    });
  });

  router.post(
    `${prefix}/process-image`,
    upload.single("image"),
    async (req, res) => {
      try {
        const imageFile = req.file as Express.Multer.File;
        if (!imageFile) {
          return res.status(400).json({ error: "No image file provided" });
        }

        // Set a longer timeout for the response
        res.setTimeout(30000, () => {
          console.log("Response timeout reached");
          // This will only execute if the response hasn't been sent yet
          if (!res.headersSent) {
            res.status(504).json({
              error: "Gateway timeout",
              message:
                "The request is taking too long to process. Please try with a smaller or less complex image.",
            });
          }
        });

        const result = await processImage(imageFile);
        res.json({
          result,
          environment,
        });
      } catch (error) {
        console.error("Error in processing image:", error);

        if (!res.headersSent) {
          if ((error as Error).message.includes("timeout")) {
            return res.status(504).json({
              error: "Gateway timeout",
              message:
                "The request is taking too long to process. Please try with a smaller or less complex image.",
            });
          }

          // Handle other errors
          res.status(500).json({
            error: "Failed to process the image",
            message: (error as Error).message || "Unknown error",
          });
        }
      }
    }
  );
});

router.get(`${baseApiVersion}/process-image`, (req, res) => {
  res.json({
    status: "ready",
    message:
      "Image processing endpoint is available. Please send a POST request with an image file.",
    environment,
    timestamp: new Date().toISOString(),
  });
});

router.post(
  `${baseApiVersion}/process-image`,
  upload.single("image"),
  async (req, res) => {
    try {
      const imageFile = req.file as Express.Multer.File;
      if (!imageFile) {
        return res.status(400).json({ error: "No image file provided" });
      }

      // Set a longer timeout for the response
      res.setTimeout(30000, () => {
        console.log("Response timeout reached");
        // This will only execute if the response hasn't been sent yet
        if (!res.headersSent) {
          res.status(504).json({
            error: "Gateway timeout",
            message:
              "The request is taking too long to process. Please try with a smaller or less complex image.",
          });
        }
      });

      const result = await processImage(imageFile);
      res.json({
        result,
        environment,
      });
    } catch (error) {
      console.error("Error in processing image:", error);
      // Check if headers were already sent
      if (!res.headersSent) {
        // Handle timeout error specifically
        if ((error as Error).message.includes("timeout")) {
          return res.status(504).json({
            error: "Gateway timeout",
            message:
              "The request is taking too long to process. Please try with a smaller or less complex image.",
          });
        }

        // Handle other errors
        res.status(500).json({
          error: "Failed to process the image",
          message: (error as Error).message || "Unknown error",
        });
      }
    }
  }
);

export default router;
