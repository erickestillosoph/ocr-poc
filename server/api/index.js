// Vercel Serverless Function Export
import express from "express";
import cors from "cors";
import serverless from "serverless-http";

// Define environment
const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";
const environment = isProduction ? "production" : "local";

console.log(`[Server] Running in ${environment} environment (API handler)`);

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

// Create handler with specific Vercel configuration
const handler = serverless(app);

// Export handler for Vercel
export default async function (req, res) {
  try {
    // Process the serverless request
    return await handler(req, res);
  } catch (error) {
    console.error("Serverless function error:", error);

    // Provide a fallback response for errors
    res.status(500).json({
      error: "Internal Server Error",
      message:
        "The server encountered an unexpected condition that prevented it from fulfilling the request.",
      timestamp: new Date().toISOString(),
    });
  }
}
