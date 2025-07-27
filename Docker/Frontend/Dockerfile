FROM node:22.11.0-bookworm

COPY ./Frontend /Frontend
COPY ./Docker/Frontend/tools/setup.sh /scripts/setup.sh
RUN chmod +x /scripts/setup.sh

WORKDIR /Frontend

CMD [ "/scripts/setup.sh" ]
