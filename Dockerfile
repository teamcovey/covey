FROM node

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN npm install
RUN npm install -g bower
RUN bower install --allow-root

EXPOSE 3000
CMD ["node", "server/server.js"]
