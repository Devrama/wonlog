FROM node:12-alpine

EXPOSE 8080

ENV NODE_ENV production

WORKDIR /home/node/app

COPY . .

RUN npm ci

CMD ["npm", "run", "serve"]
