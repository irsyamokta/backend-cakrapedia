FROM node:23.11.0-slim

WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y openssl libssl-dev \
    && apt-get clean

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["npm", "run", "start"]
