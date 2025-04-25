import { defineBuildConfig } from 'unbuild'
import { wasm } from '@rollup/plugin-wasm';

export default defineBuildConfig({
  entries: ['src/adapter.ts', 'src/adapter-node.ts', 'src/adapter-browser.ts'],
  declaration: true,
  clean: true,
  failOnWarn: false,
  hooks: {
    "rollup:options": (ctx, options) => {
      options.plugins.push(wasm())
    }
  },
  rollup: {
    emitCJS: true,
    dts: {
      tsconfig: 'tsconfig.declaration.json',
    },
    output: {
      generatedCode: 'es5'
    },
  },
})
