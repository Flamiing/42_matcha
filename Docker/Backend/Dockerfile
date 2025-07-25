FROM node:22.11.0-bookworm

COPY ./Backend /backend
COPY ./Docker/Backend/tools/ .
RUN chmod +x /setup.sh

WORKDIR /backend

ENTRYPOINT [ "bash", "/setup.sh" ]
