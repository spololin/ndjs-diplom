FROM node:20 AS build

WORKDIR /ndjs-diplom/app
COPY ./package*.json ./
RUN npm install
COPY . .

CMD [ "npm", "start"]
