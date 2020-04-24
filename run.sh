#!/bin/sh

current_time=$(date "+%Y.%m.%d-%H.%M")

npm index.js --html=./cloudsploit_$current_time.html
npm uploader.js ./cloudsploit_$current_time.html
