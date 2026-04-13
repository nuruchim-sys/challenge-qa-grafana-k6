FROM grafana/k6:latest

WORKDIR /usr/src/app

COPY ./ /usr/src/app
