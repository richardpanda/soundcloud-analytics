FROM node:8.1.3

ENTRYPOINT ["dockerize", "-wait", "http://elasticsearch:9200", "-wait", "tcp://postgres:5432", "-timeout", "20s"]

ENV DOCKERIZE_VERSION v0.5.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

RUN mkdir mkdir -p /usr/server
WORKDIR /usr/server

COPY package.json /usr/server
RUN npm install && npm cache clean --force
COPY . /usr/server

CMD ["npm", "test"]
