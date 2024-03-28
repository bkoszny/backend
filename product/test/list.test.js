import {products} from '../products';
import {getProductsList} from '../list';

test('getProductsList should return products', async () => {
  getProductsList().then(data => {
    expect(data).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify(products),
    });
  })
});