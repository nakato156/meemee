# Usa una imagen de Node.js como base
FROM node:21-alpine3.18

WORKDIR /web

COPY . .
# COPY package*.json ./

RUN npm install

EXPOSE 3000

# ENV MONGODB_URI <tu URI de MongoDB Atlas>

CMD ["npm", "run", "dev"]
