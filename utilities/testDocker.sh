#!/bin/bash
docker container rm -f test
docker pull tutum/hello-world
docker run --name test -d -p 80 tutum/hello-world 