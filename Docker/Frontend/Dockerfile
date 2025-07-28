FROM node:22.11.0-bookworm

COPY ./tools/setup.sh /scripts/setup.sh
RUN chmod +x /scripts/setup.sh

WORKDIR /Frontend

ENTRYPOINT [ "bash", "/scripts/setup.sh" ]
