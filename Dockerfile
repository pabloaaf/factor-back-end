FROM node:12.10.0-alpine
WORKDIR /myProject
ADD . /myProject
RUN npm install
EXPOSE 3000
CMD npm start