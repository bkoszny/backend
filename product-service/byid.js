const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

export const getProductsById = async (event) => {

  const product = await dynamodb.scan({
    TableName: process.env.TABLE_PRODUCTS,    
    FilterExpression: 'contains(id, :idValue)',
    ExpressionAttributeValues: {
        ':idValue': event.pathParameters.param
    },
  }).promise();

  const stocksData = await dynamodb.scan({
    TableName: process.env.TABLE_STOCKS
  }).promise();

  if (product.Items.length > 0) {
    product.Items[0].count = stocksData.Items.find(stock => stock.product_id === product.Items[0].id)?.count || 0
    return {
      statusCode: 200,
      body: JSON.stringify(product.Items[0]),
    };
  } else {
    return {
      statusCode: 404,
      body: `produc with id: ${event.pathParameters.param} not found.`,
    };
  }
};
