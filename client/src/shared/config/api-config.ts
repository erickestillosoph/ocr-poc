import axios from "axios";

// API configuration
const API_URL = import.meta.env.VITE_API_URL;
const API_URL_PROD = import.meta.env.VITE_API_URL_PROD;

const API_VERSION = import.meta.env.VITE_API_VERSION;
export const API_KEY = import.meta.env.VITE_API_KEY || "dev-api-key-1234";

const isProduction = window.location.hostname !== "localhost";
export const baseApiUrl = isProduction ? API_URL_PROD : API_URL;
// export const baseApiVersion = isProduction ? "" : API_VERSION;

export const apiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// apiClient.interceptors.request.use((config) => {

//   if (!config.params) {
//     config.params = {};
//   }
//   config.params.apiKey = API_KEY;

//   return config;
// });

// Export API paths
export const apiPaths = {
  uploadPdf: `${baseApiUrl}${API_VERSION}/process-pdf`,
  uploadImage: `${baseApiUrl}${API_VERSION}/process-image`,
  info: `${baseApiUrl}/app/info`,
};
