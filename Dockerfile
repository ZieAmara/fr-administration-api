FROM node:18-alpine

WORKDIR /backend

COPY . .

RUN npm install
RUN npm run build

CMD ["node", "dist/main.js"]

EXPOSE 3000
