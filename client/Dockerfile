FROM node:21.6.0-alpine3.18

WORKDIR /usr/local/app

COPY package.json package-lock.json /usr/local/app/

RUN npm install && npm cache clean --force

RUN npm install typescript serve -g

COPY ./ /usr/local/app/

RUN npm run build

EXPOSE 3000

CMD [ "serve", "-s", "build" ]