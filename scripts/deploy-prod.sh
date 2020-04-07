#!/bin/bash

# kill running servers
pkill -9 uvicorn

sh ./scripts/update-client.sh

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

echo "Server started successfully! Logs are available at api/nohup.out"
