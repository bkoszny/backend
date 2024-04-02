const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const getProductsList = async () => {
  const productsData = await dynamodb.scan({
    TableName: process.env.TABLE_PRODUCTS
  }).promise();

  const stocksData = await dynamodb.scan({
    TableName: process.env.TABLE_STOCKS
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(productsData.Items.map(product => {
      product.count = stocksData.Items.find(stock => stock.product_id === product.id)?.count || 0;
      return product;
    })),
  };
};
