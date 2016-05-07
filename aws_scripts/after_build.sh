#!/bin/bash
cd /var/www/covey
docker rm -f covey
docker rmi covey:latest
docker build -t covey .
docker run --name=postgres -d postgres
docker run -d -p 3000:3000 --name=covey --link postgres:postgres covey
