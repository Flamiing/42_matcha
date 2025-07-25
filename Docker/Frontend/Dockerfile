FROM node:22.11.0-bookworm

COPY ./Frontend /Frontend
COPY ./Docker/Frontend/tools/ .
RUN chmod +x /setup.sh

WORKDIR /Frontend

ENTRYPOINT [ "bash", "/setup.sh" ]
