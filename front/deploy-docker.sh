#!/bin/bash

curl -H "Content-Type: application/json" --data '{"docker_tag": "front"}' -X POST https://registry.hub.docker.com/u/goncharovnikita/treader/trigger/31d326b1-a91c-4b4f-8bdb-41df0d3c82fe/