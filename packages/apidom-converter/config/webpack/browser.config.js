import path from 'node:path';
import { nonMinimizeTrait, minimizeTrait } from './traits.config.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const browser = {
  mode: 'production',
  entry: ['./src/index.ts'],
  target: 'web',
  performance: {
    maxEntrypointSize: 1100000,
    maxAssetSize: 1100000,
  },
  output: {
    path: path.resolve('./dist'),
    filename: 'apidom-converter.browser.js',
    libraryTarget: 'umd',
    library: 'apidomConverter',
  },
  resolve: {
    extensions: ['.ts', '.mjs', '.js', '.json'],
    fallback: {
      "fs": false,
      "tls": false,
      "net": false,
      "path": false,
      "zlib": false,
      "http": false,
      "https": false,
      "util": false,
      "url": require.resolve("url/"),
      'buffer': require.resolve('buffer/'),
      "os": false ,
      "stream": false,
      "crypto": false
    }
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        loader: 'file-loader',
        type: 'javascript/auto',
      },
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
            rootMode: 'upward',
          },
        },
      },
    ],
  },
  ...nonMinimizeTrait,
};

const browserMin = {
  mode: 'production',
  entry: ['./src/index.ts'],
  target: 'web',
  output: {
    path: path.resolve('./dist'),
    filename: 'apidom-converter.browser.min.js',
    libraryTarget: 'umd',
    library: 'apidomConverter',
  },
  resolve: {
    extensions: ['.ts', '.mjs', '.js', '.json'],
    fallback: {
      "fs": false,
      "tls": false,
      "net": false,
      "path": false,
      "zlib": false,
      "http": false,
      "https": false,
      "util": false,
      "url": false,
      'buffer': require.resolve('buffer/'),
      "os": false ,
      "stream": false,
      "crypto": false
    }
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        loader: 'file-loader',
        type: 'javascript/auto',
      },
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
            rootMode: 'upward',
          },
        },
      },
    ],
  },
  ...minimizeTrait,
};

export default [browser, browserMin];
