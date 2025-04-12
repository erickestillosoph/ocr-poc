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

try {
  // Register ts-node for TypeScript support
  register("ts-node/esm", pathToFileURL("./"), {
    project: "./tsconfig.json",
  });

  // Import the main application
  const { default: app } = await import("./src/index.ts");

  // In production, we don't start a server as serverless functions are used
  console.log("Application imported successfully for serverless environment");
} catch (err) {
  console.error("Failed to import application:", err);
  process.exit(1);
}
