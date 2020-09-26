#!/bin/sh

REGISTRY=$1
TOKEN=$2
REPOSITORY=$3
TARGET=$4
TAGS=$5

if [[ $REGISTRY == "ghcr.io" ]]
then
  TOKEN=$(echo $TOKEN | base64)
fi

curl "https://${REGISTRY}/v2/${REPOSITORY}/manifests/${TARGET}" \
  -H "accept: application/vnd.docker.distribution.manifest.v2+json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -o "manifest-${TARGET}.json" \
  -s

for tag in $TAGS
do
  curl -XPUT "https://${REGISTRY}/v2/${REPOSITORY}/manifests/${tag}" \
    -H "content-type: application/vnd.docker.distribution.manifest.v2+json" \
    -H "Authorization: Bearer ${TOKEN}" \
    --data-binary "@manifest-${TARGET}.json" \
    -s
  echo "::debug::${TARGET} tagged as ${tag}"
done
