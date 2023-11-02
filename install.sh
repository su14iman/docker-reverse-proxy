#! /bin/bash
npm install -g pm2 && npm install && pm2 start src/index.js --name "docker-reverse-proxy"