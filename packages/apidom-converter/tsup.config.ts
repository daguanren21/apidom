import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  minify: true,
  splitting: false,
  tsconfig: 'tsconfig.declaration.json',
  treeshake: true,
  target: 'es5',
})
