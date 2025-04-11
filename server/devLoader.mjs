import { createRequire } from "module";
import { register } from "node:module";
import { pathToFileURL } from "node:url";
const require = createRequire(import.meta.url);

(async () => {
  // Register ts-node with ES module support
  await import("ts-node").then((tsNode) =>
    tsNode.register({
      transpileOnly: true,
      compilerOptions: {
        module: "ESNext",
      },
    })
  );

  // Import and start the server
  const { default: app } = await import("./src/index.ts");
  const port = 3001;
  app.listen(port, () => {
    console.log(`🚀 Server running locally at http://localhost:${port}`);
  });
})();

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
