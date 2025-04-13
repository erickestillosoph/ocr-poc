// Define supported API prefixes
export const API_PREFIXES = ["/api", "/app"];

// Define environment
export const API_VERSION = process.env.API_VERSION || "";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const isProduction = NODE_ENV === "production";
export const environment = isProduction ? "production" : "local";
export const baseApiVersion = isProduction ? "" : API_VERSION;
