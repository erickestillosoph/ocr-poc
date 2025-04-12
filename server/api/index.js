// Vercel Serverless Function - Optimized for quick startup
import express from "express";
import cors from "cors";
import serverless from "serverless-http";

// Lightweight Express app
const app = express();

// Configure CORS with the package
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Environment info (kept simple)
const environment =
  process.env.NODE_ENV === "production" ? "production" : "local";

// Fast response health check
app.get("/", (req, res) => {
  res.status(200).send(`OK - ${environment}`);
});

// Simplified API route
app.get("/api/info", (req, res) => {
  res.json({
    status: "ok",
    environment,
  });
});

// Efficient serverless handler
const handler = serverless(app);

// Export optimized handler for Vercel
export default async function (req, res) {
  return handler(req, res);
}
