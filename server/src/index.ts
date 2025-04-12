import express from "express";
import cors from "cors";
import serverless from "serverless-http";

// Define environment
const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";
const environment = isProduction ? "production" : "local";

console.log(`[Server] Running in ${environment} environment`);

// Create Express app
const app = express();

// Configure CORS
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment,
    timestamp: new Date().toISOString(),
  });
});

// Sample API route
app.get("/api/info", (req, res) => {
  res.json({
    version: "1.0.0",
    environment,
    description: "OCR API Service",
    endpoints: [
      { path: "/", method: "GET", description: "Health check" },
      { path: "/api/info", method: "GET", description: "API information" },
    ],
  });
});

// Start server if not in production (serverless) environment
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server ready on port ${port}`));
}

// Export the serverless handler
export const handler = serverless(app);

// Default export
export default app;
