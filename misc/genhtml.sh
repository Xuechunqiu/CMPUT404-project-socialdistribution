#!/bin/bash
java -jar openapi-generator-cli-5.1.0.jar generate -g html -i docs.yaml -o docs
mv ./docs/index.html ./
rm -r ./docs