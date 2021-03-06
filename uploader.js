const {Storage} = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage();

if(process.argv.length < 3){
    console.log("Need file to upload");
    process.exit(1);
}

const fileName = process.argv[2];
const bucketName = process.env.BUCKET_NAME;
const uploadDir = process.env.UPLOAD_DIR;

if(!bucketName){
    console.log("Need BUCKET_NAME configuration to upload");
    process.exit(1);
}

let destination = fileName;
if(uploadDir){
    destination = path.join(uploadDir, fileName);
}

storage.bucket(bucketName).upload(fileName, {
    gzip: true,
    destination: destination,
}).then(() => {
    console.log(`${fileName} uploaded to ${bucketName}.`);
}).catch(console.error);
