import { defineConfig } from 'tsup';


export default defineConfig({
  entry: ['src/parser.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  minify: true,
  splitting: false,
  treeshake: true,
   tsconfig: 'tsconfig.declaration.json',
 target: 'es5',
})
