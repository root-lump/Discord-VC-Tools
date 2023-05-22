##########################################################
#### build stage
FROM node:18.16.0-alpine3.16 as builder
WORKDIR /app

# install package for build
COPY package*.json ./
RUN npm install

# copy Typescript files & build
COPY src tsconfig.json ./
RUN npm run build

##########################################################
#### create Image
FROM node:18.16.0-alpine3.16 as runner
WORKDIR /app

ENV PORT 3000
EXPOSE 3000

# Install packages
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# copy build result
COPY --from=builder /app/build ./build