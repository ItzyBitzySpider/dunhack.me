FROM postgres:14.2
ENV TZ=Asia/Singapore
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY init.sh /docker-entrypoint-initdb.d/
ENV POSTGRES_USER "root"
ENV POSTGRES_PASSWORD "root"
ENV POSTGRES_DB "db"
EXPOSE 5432