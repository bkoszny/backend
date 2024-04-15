import {products} from '../products';
import {getProductsById} from '../byid';

test('getProductsById should return 404 if product is not available', async () => {
  getProductsById({pathParameters: {param: '123'}}).then(data => {
    expect(data).toStrictEqual({
      statusCode: 404,
      body: 'produc with id: 123 not found.',
    });
  })
});

test('getProductsById should return product if id is matching', async () => {
  getProductsById({pathParameters: {param: '7567ec4b-b10c-48c5-9345-fc73c48a80aa'}}).then(data => {
    expect(data).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify({
        description: "Yarlington Mill apple tree 2 years",
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
        price: 24,
        title: "Yarlington Mill 2 yrs",
      }),
    });
  })
});