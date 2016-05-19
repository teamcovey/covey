#!/bin/bash
cd /var/www/covey
docker rm -f covey
docker rmi covey:latest
docker build -t covey .
# docker run --name=postgres -d postgres
docker run -e "covey_env=PROD" -d -p 80:80 --name=covey --link postgres:postgres covey
