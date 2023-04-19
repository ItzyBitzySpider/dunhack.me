
FROM node:16
ENV TZ=Asia/Singapore
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt-get update && apt-get -y install postgresql-client-common
WORKDIR /app
COPY ./package.json ./
COPY . /app
RUN npm install --legacy-peer-deps
RUN npx prisma generate
EXPOSE 3000
ENTRYPOINT ["npm" , "run", "dev"]
