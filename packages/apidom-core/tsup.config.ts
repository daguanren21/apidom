import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  clean: true,
  minify: true,
  splitting: false,
  dts: true,
  treeshake: true,
  tsconfig: 'tsconfig.declaration.json',
  target: 'es5',
})
