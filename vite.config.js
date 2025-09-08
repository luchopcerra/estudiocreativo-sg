import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";

export default defineConfig({
  plugins: [react(), imagetools()],
  server: {
    allowedHosts: ["localhost", "480724ec259c.ngrok-free.app"],
  },
});
