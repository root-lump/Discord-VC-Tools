##########################################################
#### for Debug or Develop
FROM node:18.16.0-alpine3.16

ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

ENV PORT 3000
EXPOSE 3000
