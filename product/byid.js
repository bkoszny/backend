import { products } from './products';

export const getProductsById = async (event) => {
  const product = products.find(elem => elem.id === event.pathParameters.param);
  if (product) {
    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } else {
    return {
      statusCode: 404,
      body: `produc with id: ${event.pathParameters.param} not found.`,
    };
  }
};
