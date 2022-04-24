FROM node:16

WORKDIR /app

COPY ./package.json ./
COPY . /app

RUN npm install --legacy-peer-deps

RUN apt update
RUN npx prisma generate

EXPOSE 3000
ENTRYPOINT ["npm" , "run", "dev"]
