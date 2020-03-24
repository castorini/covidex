# base image
FROM node:12.16.1-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json yarn.lock /app/
RUN yarn install --silent

# copy all app files
COPY . /app/

# start app
CMD ["yarn", "start"]
