FROM nginx
COPY default.conf /etc/nginx/conf.d/
COPY ./certs /etc/nginx/certs
ENV TZ=Asia/Singapore
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
EXPOSE 80
EXPOSE 443
