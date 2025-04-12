// Vercel Serverless Function Export
import app from "../dist/index.js";
import serverless from "serverless-http";

// Create handler with specific Vercel configuration
const handler = serverless(app, {
  provider: {
    type: "vercel",
    stage: process.env.NODE_ENV || "development",
  },
});

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
