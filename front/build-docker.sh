#!/bin/sh

docker build --rm -f Dockerfile -t goncharovnikita/treader:front . && \
docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD" && \
docker push goncharovnikita/treader:front