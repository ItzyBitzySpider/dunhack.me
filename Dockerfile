FROM node:16
ENV TZ=Asia/Singapore
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /app
COPY ./package.json ./
COPY . /app
RUN npm install --legacy-peer-deps
RUN apt update
RUN apt install -y dos2unix
RUN dos2unix /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
RUN npx prisma generate
EXPOSE 3000
ENTRYPOINT ["/app/entrypoint.sh"]
