
FROM golang:1.9.2

ARG stage

WORKDIR /back/

ADD . /back/

RUN ./install-deps.sh && env GOOS=linux GOARCH=386 go build

FROM alpine:latest

COPY --from=0 /back/. .

EXPOSE 8080

CMD [ "./back" ]