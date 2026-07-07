import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    watch: {
      ignored: ['**/автосервис/**']
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        site1: resolve(__dirname, 'сайт_первый_для_портфолио/index.html'),
        site1_outerwear: resolve(__dirname, 'сайт_первый_для_портфолио/outerwear/index.html'),
        site1_pants: resolve(__dirname, 'сайт_первый_для_портфолио/pants/index.html'),
        site1_headwear: resolve(__dirname, 'сайт_первый_для_портфолио/headwear/index.html'),
        site2: resolve(__dirname, 'автосервис/index.html'),
        studentfood: resolve(__dirname, 'СтудентФуд/index.html'),
        pc_configurator: resolve(__dirname, 'pc-configurator/index.html')
      }
    }
  }
});
