import { readdirSync } from "fs";
import { Hono } from "hono";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function loadRoutes(app: Hono) {
  // In development, we're in src/utils, in production we're in dist/utils
  const isDevelopment = __dirname.includes('src');
  const routesDir = isDevelopment 
    ? join(__dirname, "..", "routes")
    : join(__dirname, "..", "routes");
  
  const files = readdirSync(routesDir)
    .filter(file => file.endsWith(isDevelopment ? ".ts" : ".js") && !file.endsWith("index.js"));
  
  for (const file of files) {
    const routePath = `file://${join(routesDir, file)}`;
    try {
      const route = await import(routePath);
      app.route("/api", route.default);
    } catch (error) {
      console.error(`Failed to load route ${file}:`, error);
    }
  }
}