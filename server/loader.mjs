// Suppress DEP0180 warning about fs.Stats constructor
// process.removeAllListeners("warning");
// process.on("warning", (warning) => {
//   if (
//     warning.name === "DeprecationWarning" &&
//     warning.code === "DEP0180" &&
//     warning.message.includes("fs.Stats constructor is deprecated")
//   ) {
//     return;
//   }
//   console.warn(warning);
// });

import { register } from "node:module";
import { pathToFileURL } from "node:url";

// Load environment variables in non-production environment
if (process.env.NODE_ENV !== "production") {
  try {
    await import("dotenv/config");
    console.log("dotenv loaded in non-production environment");
  } catch (err) {
    console.error("Failed to load dotenv:", err);
  }
}

// Setup TS compiler
register("ts-node/esm", pathToFileURL("./"), {
  project: "./tsconfig.json",
});

// This is a workaround to handle both ESM and CJS in Vercel
let handler;

try {
  // Import the Express application
  const { handler: appHandler } = await import("./src/api/pages/index.ts");
  handler = appHandler;
  console.log("Express application handler loaded successfully");
} catch (err) {
  console.error("Failed to import application:", err);

  // Provide a fallback handler that returns an error
  handler = (req, res) => {
    res
      .status(500)
      .send("Server failed to initialize: " + (err.message || "Unknown error"));
  };
}

// Export the handler for Vercel
export default handler;
