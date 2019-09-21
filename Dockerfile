FROM node:12.10.0-alpine

#send node to base route
WORKDIR /factor
ADD . /factor

#update config
RUN npm install

#outside port
EXPOSE 3000

#start
CMD npm start