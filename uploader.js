const {Storage} = require('@google-cloud/storage');
const storage = new Storage();
const filename = process.argv.slice(2);

const bucketName = process.env.BUCKET_NAME;

async function uploadFile() {
    // Uploads a local file to the bucket
    await storage.bucket(bucketName).upload(filename, {
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        gzip: true
    });

    console.log(`${filename} uploaded to ${bucketName}.`);
}

uploadFile().catch(console.error)
