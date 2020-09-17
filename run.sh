#!/bin/sh

current_time=$(date "+%Y.%m.%d-%H.%M")

node index.js --html=./cloudsploit_$current_time.html --config=./config.js && \
node uploader.js cloudsploit_$current_time.html && \
node slack.js cloudsploit_$current_time.html
