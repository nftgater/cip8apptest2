import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import wasm from 'vite-plugin-wasm';
import vue from '@vitejs/plugin-vue'

//import wasm from './node_modules/vite-plugin-wasm';
import topLevelAwait from "vite-plugin-top-level-await";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    wasm(),
    topLevelAwait(), 
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib_bg.wasm': 'vite-plugin-wasm',
    }
  }
})
