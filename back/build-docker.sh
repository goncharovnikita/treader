#!/bin/sh

docker build --rm -f Dockerfile --build-arg stage=$STAGE -t goncharovnikita/treader:back-$STAGE . && \
docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD" && \
docker push goncharovnikita/treader:back-$STAGE