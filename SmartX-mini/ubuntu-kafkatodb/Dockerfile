FROM node:7
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN curl -G -XPOST http://192.168.1.114:8086/query --data-urlencode \"u=dnslabInflux\" --data-urlencode \"p=dnslab\" --data-urlencode "q=CREATE USER dnslabInflux WITH PASSWORD 'dnslab' WITH ALL PRIVILEGES"
RUN curl -G -XPOST http://192.168.1.114:8086/query --data-urlencode \"u=dnslabInflux\" --data-urlencode \"p=dnslab\" --data-urlencode "q=CREATE DATABASE dnslabdatabases"

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

CMD ["npm","start"]


EXPOSE 3000
