FROM jrottenberg/ffmpeg:4.1-alpine AS ffmpeg

FROM node:12.10.0-alpine

COPY --from=ffmpeg / /

#send node to base route
WORKDIR /factor
ADD . /factor

#update config
RUN npm install

#outside port
EXPOSE 3000

#start
CMD npm run start_local