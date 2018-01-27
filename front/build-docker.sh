#!/bin/sh

docker build --rm -f Dockerfile --build-arg stage=$STAGE -t goncharovnikita/treader:front-$STAGE . && \
docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD" && \
docker push goncharovnikita/treader:front-$STAGE