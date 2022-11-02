import { PRODUCT_DB_PORT } from 'src/constants';

export const custom = {
  esbuild: {
    bundle: true,
    minify: false,
    sourcemap: true,
    exclude: ['aws-sdk'],
    target: 'node14',
    define: { 'require.resolve': undefined },
    platform: 'node',
    concurrency: 10,
  },
  autoswagger: {
    typefiles: [],
    swaggerFiles: ['./docs/definitions.json', './docs/info.json', './docs/tags.json'],
    basePath: '/dev',
    apiType: 'http',
  },
  dynamodb: {
    start: {
      port: PRODUCT_DB_PORT,
      inMemory: true,
      migrate: true,
    },
    stages: 'dev'
  }
}