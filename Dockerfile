FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=development

USER root

COPY package*.json ./

COPY . .

RUN npm install

ENTRYPOINT ["npm", "run", "dev"]

EXPOSE 3000