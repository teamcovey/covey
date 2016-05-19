FROM node

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN npm install
RUN npm install -g bower
RUN npm install -g gulp
RUN bower install --allow-root

RUN gulp go-prod

EXPOSE 80
CMD ["node", "server/server.js"]
