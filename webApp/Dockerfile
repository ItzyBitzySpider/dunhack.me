FROM node:16

WORKDIR /app

COPY ./package.json ./
COPY . /app

RUN npm install --legacy-peer-deps

RUN apt update
RUN apt install -y dos2unix
RUN dos2unix entrypoint.sh
RUN npx prisma generate

EXPOSE 3000
ENTRYPOINT ["/app/entrypoint.sh"]
