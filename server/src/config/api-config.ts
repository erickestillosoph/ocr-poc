export const API_PREFIXES = ["/api/v1"];

// Define environment
export const NODE_ENV = process.env.NODE_ENV || "development";
export const isProduction = NODE_ENV === "production";
export const environment = isProduction ? "production" : "local";
export const API_VERSION = process.env.API_VERSION || "";
export const API_KEY = process.env.API_KEY || "dev-api-key-123";

export const baseApiVersion = isProduction ? "" : API_VERSION;
