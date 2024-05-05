const AWS = require('aws-sdk');
const csv = require('csv-parser')
const s3 = new AWS.S3({region: 'us-east-1'});

const BUCKET = 'import-123456';

export const importProductsFile = async (event) => {
    const fileName = event.queryStringParameters?.name;

    if (!fileName) {
        return {
            statusCode: 400,
            body: 'missing name parameter.',
        };
    }

    const params = {
        Bucket: BUCKET,
        Key: `uploaded/${fileName}`,
        Expires: 60,
        ContentType: 'text/csv'
    }

    const signedUrl = await new Promise((res, rej) => {
        s3.getSignedUrl('putObject', params, (err, url) => {
            if (err) {
                rej(err)
            }
            res(url)
        })
    });

    return {
        statusCode: 200,
        body: signedUrl,
    };
}

export const importFileParser = async (event) => {
    const bucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;

    const params = {
        Bucket: bucket,
        Key: key
    };
    const s3ObjectStream = s3.getObject(params).createReadStream();

    const sqs = new AWS.SQS({ region: 'us-east-1' });
    const sqsUrl = 'https://sqs.us-east-1.amazonaws.com/851725557379/catalogItemsQueue';
    s3ObjectStream.pipe(csv()).on('data', async (chunk) => {
        // console.log(`===> ${JSON.stringify(chunk)}`);
        await sqs.sendMessage({
            QueueUrl: sqsUrl,
            MessageBody: JSON.stringify(chunk),
            MessageAttributes: {}
        }).promise();
    });

    await new Promise((res) => {
        s3ObjectStream.on('end', () => {
            res();
        });
    });

    await s3.copyObject({
        Bucket: bucket,
        CopySource: bucket + '/' + key,
        Key: key.replace('uploaded', 'parsed')
    }).promise();

    await s3.deleteObject({
        Bucket: bucket,
        Key: key
    }).promise();

    return {
        statusCode: 200
    }
}
