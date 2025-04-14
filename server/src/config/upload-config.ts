import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine if running on Vercel
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";

// Set uploads directory configuration
export const uploadsDir =
  isVercel || process.env.NODE_ENV === "production"
    ? path.join("/tmp", "uploads")
    : path.join(__dirname, "..", "..", "uploads");

// Only use src/uploads in development environment
export const srcUploadsDir =
  isVercel || process.env.NODE_ENV === "production"
    ? null // Don't use src/uploads in production/Vercel
    : path.join(__dirname, "..", "..", "uploads");

// Initialize upload directories
export function initializeUploadDirectories(logPrefix = "") {
  console.log(`${logPrefix}Uploads directory set to: ${uploadsDir}`);
  if (srcUploadsDir) {
    console.log(`${logPrefix}Src uploads directory set to: ${srcUploadsDir}`);
  }

  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    console.log(`${logPrefix}Creating uploads directory at: ${uploadsDir}`);
    try {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log(
        `${logPrefix}Successfully created uploads directory at: ${uploadsDir}`
      );
    } catch (err) {
      console.error(
        `${logPrefix}Error creating uploads directory at ${uploadsDir}:`,
        err
      );
      // If /tmp/uploads fails, try alternate location
      if (uploadsDir.startsWith("/tmp")) {
        const altDir = "/tmp";
        console.log(
          `${logPrefix}Attempting to create alternate directory at: ${altDir}`
        );
        try {
          if (!fs.existsSync(altDir)) {
            fs.mkdirSync(altDir, { recursive: true });
          }
          console.log(
            `${logPrefix}Successfully created alternate directory at: ${altDir}`
          );
        } catch (altErr) {
          console.error(
            `${logPrefix}Error creating alternate directory:`,
            altErr
          );
        }
      }
    }
  }

  // Only create src/uploads directory in development environment
  if (srcUploadsDir && !isVercel && process.env.NODE_ENV !== "production") {
    console.log(
      `${logPrefix}Creating src uploads directory at: ${srcUploadsDir}`
    );
    try {
      fs.mkdirSync(srcUploadsDir, { recursive: true });
      console.log(
        `${logPrefix}Successfully created src uploads directory at: ${srcUploadsDir}`
      );
    } catch (srcErr) {
      console.error(
        `${logPrefix}Error creating src uploads directory at ${srcUploadsDir}:`,
        srcErr
      );
    }
  }
}
