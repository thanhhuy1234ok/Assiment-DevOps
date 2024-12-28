FROM node:23-alpine3.19

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

USER node

EXPOSE 8081

CMD ["npm", "start"]