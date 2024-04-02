const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

export const createProduct = async (event) => {
    console.log(event);
    const { description, price, title } = JSON.parse(event.body);
    const uuid = AWS.util.uuid.v4();
    if (!description) {
        return {
            statusCode: 400,
            body: `missing description.`,
        };
    }

    if (!title) {
        return {
            statusCode: 400,
            body: `missing title.`,
        };
    }

    if (!price) {
        return {
            statusCode: 400,
            body: `missing price.`,
        };
    }

    const createPromise = await dynamodb.putItem({
        TableName: process.env.TABLE_PRODUCTS,    
        Item: {
            'id': { S: uuid },
            'description': { S: description },
            'title': { S: title },
            'price': { N: price}
        },
    }).promise();

    return {
        statusCode: 200,
        body: JSON.stringify(createPromise),
    };
}