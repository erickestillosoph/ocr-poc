# Server

## CORS Configuration

This server implements CORS to control which domains can access its APIs.

### Environment Variables

The following environment variables are used for CORS configuration:

- `FRONTEND_URL`: The URL of the frontend in development (e.g., <http://localhost:3000>)
- `FRONTEND_URL_PROD`: The URL of the frontend in production (e.g., <https://your-app.vercel.app>)

In development mode (`environment === 'local'`), the server allows all origins if no specific origins are set.
