FROM postgres:14.2
ENV TZ=Asia/Singapore
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY init.sh /docker-entrypoint-initdb.d/
EXPOSE 5432