import fs from "fs";
import * as path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";
import NodeGlobalsPolyfillPlugin from "@esbuild-plugins/node-globals-polyfill";

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    define: {
      __APP_ENV__: env.APP_ENV,
    },
    server: {
      port: env.VITE_PORT || 3000,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:4000",
          secure: false, // because vite wouldn't use the system SSL cert store. well, fuck you.
          changeOrigin: true,
        },
        "/crystalspider": {
          target: env.VITE_CRYSTAL_SPIDER_BASE_URL || "http://localhost:8080",
          secure: false, // because vite wouldn't use the system SSL cert store. well, fuck you.
          changeOrigin: true,
        }
      },
      cors: {
        origin: ["*"],
        methods: ["GET", "PATCH", "PUT", "POST", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: ["node_modules", "./src/assets"],
        },
      },
      postcss: {
        plugins: [require("postcss-rtl")()],
      },
    },
    resolve: {
      alias: [
        {
          find: /^~.+/,
          replacement: (val) => {
            return val.replace(/^~/, "");
          },
        },
        { find: "stream", replacement: "stream-browserify" },
        { find: "crypto", replacement: "crypto-browserify" },
        { find: "@src", replacement: path.resolve(__dirname, "src") },
        { find: "@store", replacement: path.resolve(__dirname, "src/redux") },
        {
          find: "@configs",
          replacement: path.resolve(__dirname, "src/configs"),
        },
        {
          find: "url",
          replacement: "rollup-plugin-node-polyfills/polyfills/url",
        },
        {
          find: "@styles",
          replacement: path.resolve(__dirname, "src/@core/scss"),
        },
        {
          find: "util",
          replacement: "rollup-plugin-node-polyfills/polyfills/util",
        },
        {
          find: "zlib",
          replacement: "rollup-plugin-node-polyfills/polyfills/zlib",
        },
        {
          find: "@utils",
          replacement: path.resolve(__dirname, "src/utility/Utils"),
        },
        {
          find: "@hooks",
          replacement: path.resolve(__dirname, "src/utility/hooks"),
        },
        {
          find: "@assets",
          replacement: path.resolve(__dirname, "src/@core/assets"),
        },
        {
          find: "@layouts",
          replacement: path.resolve(__dirname, "src/@core/layouts"),
        },
        {
          find: "assert",
          replacement: "rollup-plugin-node-polyfills/polyfills/assert",
        },
        {
          find: "buffer",
          replacement: "rollup-plugin-node-polyfills/polyfills/buffer-es6",
        },
        {
          find: "process",
          replacement: "rollup-plugin-node-polyfills/polyfills/process-es6",
        },
        {
          find: "@components",
          replacement: path.resolve(__dirname, "src/@core/components"),
        },
      ],
    },
    esbuild: {
      loader: "jsx",
      include: /.\/src\/.*\.js?$/,
      exclude: [],
      jsx: "automatic",
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true,
            process: true,
          }),
          {
            name: "load-js-files-as-jsx",
            setup(build) {
              build.onLoad({ filter: /src\\.*\.js$/ }, async (args) => ({
                loader: "jsx",
                contents: fs.readFileSync(args.path, "utf8"),
              }));
            },
          },
        ],
      },
    },
    build: {
      minify: false,
      cssMinify: false,
      rollupOptions: {
        plugins: [rollupNodePolyFill()],
        external: [

        ],
      },
    },
  };
});
