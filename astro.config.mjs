// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

// Wczytaj zmienne środowiskowe z pliku .env
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Log zmiennych środowiskowych przy starcie
console.log("=== Environment Variables at Startup ===");
console.log("AZURE_OPENAI_ENDPOINT:", process.env.AZURE_OPENAI_ENDPOINT);
console.log("Env file loaded:", process.env.AZURE_OPENAI_ENDPOINT ? "Yes" : "No");

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [react(), tailwind()],
  server: {
    port: 3000,
    host: true, // Dodane, aby serwer nasłuchiwał na wszystkich interfejsach
  },
  vite: {
    plugins: [],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        external: ["openai", "msw", "msw/node"],
      },
    },
    // Konfiguracja zmiennych środowiskowych
    envDir: process.cwd(), // Dodane, aby Vite szukał pliku .env w głównym katalogu
    envPrefix: ["AZURE_"],
    define: {
      "process.env.AZURE_OPENAI_API_KEY": JSON.stringify(process.env.AZURE_OPENAI_API_KEY),
      "process.env.AZURE_OPENAI_ENDPOINT": JSON.stringify(process.env.AZURE_OPENAI_ENDPOINT),
      "process.env.AZURE_OPENAI_DEPLOYMENT_NAME": JSON.stringify(process.env.AZURE_OPENAI_DEPLOYMENT_NAME),
    },
    optimizeDeps: {
      exclude: ["msw"],
    },
  },
  adapter: node({
    mode: "standalone",
  }),
  experimental: {
    session: true,
  },
});
