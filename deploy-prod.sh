#!/bin/bash

# build client
echo "Building client..."
export BUILD_PATH=./client/build
export STATIC_PATH=./api/app/static

rm -rf $BUILD_PATH
rm -rf $STATIC_PATH
cd client && yarn install --silent && yarn build && cd ..
mv $BUILD_PATH $STATIC_PATH
mv $STATIC_PATH/static/* $STATIC_PATH

# run server without the development flag
cd api
pip install -r requirements.txt
export DEVELOPMENT=False

echo "Starting server..."
PORT=${PORT:-8000}
nohup uvicorn app.main:app --port=$PORT --host 0.0.0.0 &

echo "Waiting for server availability..."
l_TELNET=`echo "quit" | telnet localhost $PORT | grep "Escape character is"` > /dev/null
while [ "$?" -ne 0 ]; do
  sleep 10
  l_TELNET=`echo "quit" | telnet localhost $PORT | grep "Escape character is"` > /dev/null
done

echo "Warming up models..."
curl http://localhost:$PORT/api/search?query=test > /dev/null

echo "Server started successfully!"
