#! /bin/bash
npm install -g pm2 && npm install && pm2 start . --name "docker-reverse-proxy"
