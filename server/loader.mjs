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

if (process.env.NODE_ENV !== "production") {
  try {
    await import("dotenv/config");
    console.log("dotenv loaded in non-production environment");
  } catch (err) {
    console.error("Failed to load dotenv:", err);
  }
}

try {
  register("ts-node/esm", pathToFileURL("./"), {
    project: "./tsconfig.json",
  });
  const mainFileUrl = pathToFileURL("./src/index.ts").href;
  await import(mainFileUrl);
} catch (err) {
  console.error("Failed to import main file:", err);
}
