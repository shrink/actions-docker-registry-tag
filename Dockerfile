FROM byrnedo/alpine-curl@sha256:548379d0a4a0c08b9e55d9d87a592b7d35d9ab3037f4936f5ccd09d0b625a342

COPY tag.sh /tag.sh
RUN chmod +x tag.sh

ENTRYPOINT ["/tag.sh"]
