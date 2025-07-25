FROM node:22.11.0-bookworm

COPY ./tools/ .
RUN ls
COPY ./src/Backend /backend
RUN chmod +x /setup.sh

WORKDIR /backend

ENTRYPOINT [ "bash", "/setup.sh" ]
