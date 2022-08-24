export default {
  summary: 'Get product list ',
  description: 'Provide All Products',
  swaggerTags: ['products'],
  responses: {
    200: {
      description: 'Successful API Response with Products',
      bodyType: 'Products'
    },
    500: {
      description: 'When something went wrong on backend side during executing',
      bodyType: 'Error'
    }
  }
};
