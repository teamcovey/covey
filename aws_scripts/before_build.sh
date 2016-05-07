#!/bin/bash
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user
cd /var/www/covey
docker rm $(docker ps -a -q)
docker rmi $(docker images -q)
docker build -t covey .
docker run -d -p 3000:3000 covey:latest
