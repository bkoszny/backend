const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

export const catalogBatchProcess = async (event) => {
    const sns = new AWS.SNS({ region: 'us-east-1' }); 

    const topicsData = await sns.listTopics().promise();
    const topics = topicsData.Topics;

    // Find the topic ARN by its name
    let topicArn;
    for (const topic of topics) {
        if (topic.TopicArn.includes('createProductTopic')) {
            topicArn = topic.TopicArn;
            break;
        }
    }

    let res = Promise.resolve()
    event.Records.forEach(rec => {
        res = res.then(() => {
            console.log("================>", rec)
            const uuid = AWS.util.uuid.v4();
            const { description, title, price } = JSON.parse(rec.body)
            return dynamodb.putItem({
                TableName: process.env.TABLE_PRODUCTS,    
                Item: {
                    'id': { S: uuid },
                    'description': { S: description },
                    'title': { S: title },
                    'price': { N: String(price)}
                },
            }).promise().then(() => {
                const params = {
                    Message: rec.body,
                    Subject: 'Product created',
                    TopicArn: topicArn
                };
                return sns.publish(params).promise();
            });
        })

    });
    await res;

    return {
        statusCode: 200
    };
};