import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: env.VITE_PORT,
      proxy: {
        "/api": {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false
        },
        "/uploads": env.REACT_APP_API_URL,
      },
    },
    optimizeDeps: {
      include: ["chartjs-adapter-date-fns"],
    },
  };
});
