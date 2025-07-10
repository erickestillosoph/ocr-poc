import axios from "axios";

// API configuration

const API_URL = import.meta.env.VITE_API_URL;
const API_URL_PROD = import.meta.env.VITE_API_URL_PROD;

const API_VERSION = import.meta.env.VITE_API_VERSION;
export const API_KEY = import.meta.env.VITE_API_KEY || "dev-api-key-1234";

const isProduction = window.location.hostname !== "localhost";
export const baseApiUrl = isProduction ? API_URL_PROD : API_URL;
<<<<<<< HEAD
=======

const API_KEY_DIFY_KEY = import.meta.env.VITE_API_KEY_DIFY;
const API_URL_DIFY = import.meta.env.VITE_API_URL_DIFY;
const API_URL_DIFY_WORKFLOW = import.meta.env.VITE_API_URL_DIFY_WORKFLOW;
>>>>>>> master
// export const baseApiUrl = API_URL;
// export const baseApiVersion = isProduction ? "" : API_VERSION;

export const apiClient = axios.create({
  headers: {
    "Content-Type": ["multipart/form-data", "application/json"],
  },
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

export const difyApiClient = axios.create({
  headers: {
    Authorization: `Bearer ${API_KEY_DIFY_KEY}`,
  },
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

export const difyApiClientWorkflow = axios.create({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY_DIFY_KEY}`,
  },
});

// Export API paths
export const apiPaths = {
  uploadPdf: `${baseApiUrl}${API_VERSION}/process-pdf`,
  uploadImage: `${baseApiUrl}${API_VERSION}/process-image`,
  uploadImageDify: `${API_URL_DIFY}`,
  uploadPdfDify: `${API_URL_DIFY}`,
  uploadWorkflowDify: `${API_URL_DIFY_WORKFLOW}`,
  info: `${baseApiUrl}/app/info`,
};
