const {request} = require('gaxios');
const path = require('path');

const webhookUrl = process.env.WEBHOOK_URL;
const slackChannel = process.env.SLACK_CHANNEL;
const bucket = process.env.BUCKET_NAME;
const uploadDir = process.env.UPLOAD_DIR;

if(!webhookUrl || !bucket){
    console.error("Need WEBHOOK_URL and BUCKET_NAME configuration");
    process.exit(1);
}

if(process.argv.length < 3){
    console.log("Need file to sent as notification");
    process.exit(1);
}

const fileName = process.argv[2];

let filePath = fileName;
if(uploadDir){
    filePath = path.join(uploadDir, fileName);
}

let url = `https://storage.cloud.google.com/${bucket}/${filePath}`;

let messageBody = {
    "channel": slackChannel,
    "text": "Your report is ready. Open link below.",
    "blocks": [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "Your report is ready. Open link below.",
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `<${url}|${fileName}>`,
            }
        },
    ]
};

console.log('Sending slack message');

request({
    url: webhookUrl,
    method: 'post',
    headers: {
        "content-type": "application/json"
    },
    data: messageBody,
}).then(function (res) {
    console.log(`Request response ${res.status} with message: ${res.statusText}`);
}).catch(console.error);
