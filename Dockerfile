FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

HEALTHCHECK --interval=30s --timeout=5s CMD pgrep node || exit 1

CMD ["npm", "start"]