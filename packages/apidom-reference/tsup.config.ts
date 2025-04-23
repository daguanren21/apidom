import { defineConfig } from 'tsup';


export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  external:['@babel/runtime-corejs3'],
  dts: true,
  clean: true,
  minify: true,
  splitting: false,
  treeshake: true,
})