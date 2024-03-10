FROM node:21.6.0-alpine3.18

WORKDIR /usr/local/app

COPY client/ ./client
COPY server/ ./server

RUN npm install -g typescript serve

RUN cd client && npm install

RUN cd client && npm run build

RUN cd server && npm install

RUN cd server && npm run build

EXPOSE 3000

CMD [ "node", "server/build/bin/www.js" ]
