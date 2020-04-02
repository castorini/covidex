#!/bin/bash

echo "Building client for production..."

export BUILD_PATH=./client/build
export STATIC_PATH=./api/app/static

rm -rf $BUILD_PATH
rm -rf $STATIC_PATH

cd client && yarn install --silent && yarn build && cd ..

mv $BUILD_PATH $STATIC_PATH
mv $STATIC_PATH/static/* $STATIC_PATH

echo "Client built successfully!"
