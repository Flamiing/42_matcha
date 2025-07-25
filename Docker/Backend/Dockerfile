FROM node:22.11.0-bookworm

COPY ./tools/ /tools/
RUN chmod +x /tools/setup.sh

WORKDIR /backend

COPY ./Backend/ .

ENTRYPOINT ["bash", "/tools/setup.sh"]