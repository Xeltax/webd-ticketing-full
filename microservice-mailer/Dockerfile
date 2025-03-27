FROM node:18

WORKDIR /app

COPY microservice-mailer/package*.json ./

RUN npm install

COPY microservice-mailer/ ./

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]