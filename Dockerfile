FROM node

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN npm install
RUN npm install -g bower
RUN bower install --allow-root

RUN gulp go-prod

EXPOSE 3000
CMD ["node", "server/server.js"]
