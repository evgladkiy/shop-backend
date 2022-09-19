export default {
  summary: 'Create product',
  description: 'Create new product',
  swaggerTags: ['products'],
  responses: {
    200: {
      description: 'Successful API Response with Product',
      bodyType: 'Product'
    },
    500: {
      description: 'When something went wrong on backend side during executing',
      bodyType: 'Error'
    }
  }
};
