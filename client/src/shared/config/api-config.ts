import axios from "axios";

// API configuration
const API_URL = import.meta.env.VITE_API_URL;
const API_URL_PROD = import.meta.env.VITE_API_URL_PROD;

const API_VERSION = import.meta.env.VITE_API_VERSION;
export const API_KEY = import.meta.env.VITE_API_KEY || "dev-api-key-1234";

// Determine the base API URL based on environment
const isProduction = window.location.hostname !== "localhost";
<<<<<<< Updated upstream
export const baseApiUrl = isProduction ? "" : API_URL;
export const baseApiVersion = isProduction ? "" : API_VERSION;
=======
export const baseApiUrl = isProduction ? API_URL_PROD : API_URL;
// export const baseApiVersion = isProduction ? "" : API_VERSION;
>>>>>>> Stashed changes

// Create axios instance with default configuration
export const apiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add API key to all requests
apiClient.interceptors.request.use((config) => {
  // Add API key as query parameter instead of header
  if (!config.params) {
    config.params = {};
  }
  config.params.apiKey = API_KEY;

  return config;
});

// Export API paths
export const apiPaths = {
  uploadPdf: `${baseApiUrl}${baseApiVersion}/process-pdf`,
  uploadImage: `${baseApiUrl}${baseApiVersion}/process-image`,
  info: `${baseApiUrl}/app/info`,
};
