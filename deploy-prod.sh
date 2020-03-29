#!/bin/bash

# build client
export BUILD_PATH=./client/build
export STATIC_PATH=./api/app/static

rm -rf $BUILD_PATH
rm -rf $STATIC_PATH
cd client && yarn install --silent && yarn build && cd ..
mv $BUILD_PATH $STATIC_PATH
mv $STATIC_PATH/static/* $STATIC_PATH

# run server without the development flag
export DEVELOPMENT=False
cd api && uvicorn app.main:app --port=${PORT:-8001} --host 0.0.0.0
