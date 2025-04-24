import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/adapter.ts','src/adapter-node.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  minify: true,
  splitting: false,
  treeshake: true,
   tsconfig: 'tsconfig.declaration.json',
 target: 'es5',
})
