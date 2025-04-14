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

// Set uploads directory inside src for better Vercel compatibility
const uploadsDir =
  isVercel || process.env.NODE_ENV === "production"
    ? path.join("/tmp", "uploads")
    : path.join(__dirname, "..", "uploads");

// Always create a src/uploads directory regardless of environment
const srcUploadsDir = path.join(__dirname, "..", "uploads");

console.log(`Image route: Uploads directory set to: ${uploadsDir}`);
console.log(`Image route: Src uploads directory set to: ${srcUploadsDir}`);

// Create both directories
try {
  // Create main uploads directory
  if (!fs.existsSync(uploadsDir)) {
    console.log(`Creating uploads directory at: ${uploadsDir}`);
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Successfully created uploads directory at: ${uploadsDir}`);
  }

  // Always create src/uploads directory regardless of environment
  if (!fs.existsSync(srcUploadsDir)) {
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
        const result = await processImage(imageFile);
        res.json({
          result,
          environment,
        });
      } catch (error) {
        console.error("Error in processing image:", error);
        res.status(500).json({ error: "Failed to process the image" });
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
      const result = await processImage(imageFile);
      res.json({
        result,
        environment,
      });
    } catch (error) {
      console.error("Error in processing image:", error);
      res.status(500).json({ error: "Failed to process the image" });
    }
  }
);

export default router;
