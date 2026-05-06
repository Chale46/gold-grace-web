import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    // SEO and performance optimizations
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', 'lucide-react'],
          utils: ['clsx', 'tailwind-merge'],
        },
      },
    },
    // Enable source maps for debugging
    sourcemap: mode === 'development',
    // Optimize chunks
    chunkSizeWarningLimit: 1000,
    // TEMP: Disable PWA manifest generation to prevent console warnings
    // manifest: true,
  },
  // SEO optimization
  define: {
    // Set global variables for SEO
    __DEV__: mode === 'development',
  },
  // Enable CSS optimization
  css: {
    devSourcemap: mode === 'development',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
}));
