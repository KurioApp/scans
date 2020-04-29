#!/bin/sh

current_time=$(date "+%Y.%m.%d-%H.%M")

node index.js --html=./cloudsploit_$current_time.html
node uploader.js cloudsploit_$current_time.html
node slack.js cloudsploit_$current_time.html
