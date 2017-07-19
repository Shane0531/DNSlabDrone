FROM node:7
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

RUN curl -G http://localhost:8086/query --data-urlencode \"u=dnslabInflux\" --data-urlencode \"p=dnslab\" --data-urlencode \"q=CREATE USER dnslabInflux WITH PASSWORD 'dnslab' WITH ALL PRIVILEGES\"
RUN curl -G http://localhost:8086/query --data-urlencode \"u=dnslabInflux\" --data-urlencode \"p=dnslab\" --data-urlencode \"q=CREATE DATABASE dnslabdatabases\"

COPY . /usr/src/app

CMD ["npm","start"]


EXPOSE 3000
