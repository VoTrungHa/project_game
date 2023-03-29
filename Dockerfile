### STAGE 1: Build ###

# We label our stage as ‘builder’
FROM node:12.13.0-alpine as builder
RUN apk add g++ make python

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN mkdir /app
WORKDIR /app
COPY package.json .
RUN yarn

COPY . .

#docker build --build-arg NODE_ENV=production

## Build the angular app in production mode and store the artifacts in build folder

RUN NODE_OPTIONS="--max_old_space_size=4096" yarn build:production

### STAGE 2: Setup ###

FROM nginx:1.19.1-alpine

## Copy our default nginx config
COPY nginx.conf /etc/nginx/nginx.conf

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder’ stage copy over the artifacts in build folder to default nginx public folder
COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
