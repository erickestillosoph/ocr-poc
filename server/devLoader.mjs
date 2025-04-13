import { createRequire } from "module";
import { register } from "node:module";
import { pathToFileURL } from "node:url";
const require = createRequire(import.meta.url);

// Load environment variables first
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
  const { default: app } = await import("./src/api/index.ts");

  // Start the development servers
  const port = 3002;
  app.listen(port, () => {
    console.log(`🚀 Server running locally at http://localhost:${port}`);
  });
} catch (err) {
  console.error("Failed to start development server:", err);
  process.exit(1);
}
