FROM node:8.1.3

RUN mkdir -p /usr/client
WORKDIR /usr/client

COPY package.json package-lock.json /usr/client/
RUN npm install && npm cache clean --force
COPY . /usr/client

ENV CLIENT_SERVER_PORT=3000
ENV API_SERVER_PORT=80

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
