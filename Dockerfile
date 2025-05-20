FROM node:18-alpine

WORKDIR /app

COPY . .
COPY package.json ./
COPY .env.local /app/.env.local

RUN npm install

CMD ["npm", "run", "docker"]