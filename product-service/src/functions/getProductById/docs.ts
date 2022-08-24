export default {
  summary: 'This is a cool API',
  description: 'Cool API description is here',
  swaggerTags: ['products'],
  responses: {
    200: {
      description: 'Successful API Response with Product',
      bodyType: 'Product'
    },
    500: {
      description: 'When something went wrong on backend side during executing',
      bodyType: 'Error'
    },
    400: {
      description: 'When request is invalid',
      bodyType: 'Error'
    },
    404: {
      description: 'When cannot find product by ID',
      bodyType: 'Error'
    },
  }
};