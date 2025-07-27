FROM node:22.11.0-bookworm

COPY ./Backend /backend
COPY ./Docker/Backend/tools/setup.sh /scripts/setup.sh
RUN chmod +x /scripts/setup.sh

WORKDIR /backend

CMD [ "/scripts/setup.sh" ]
