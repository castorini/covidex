# COVID-19 Open Research Dataset Search

This repository contains the API server and UI client for searching the [COVID-19 Open Research Dataset (CORD-19)](https://pages.semanticscholar.org/coronavirus-research).

#### Local Deployment

To run the API server, follow the instructions in [api/README.md](./api/README.md).

To run the UI client, follow the instructions in [client/README.md](./client/README.md).

#### Production Deployment

Run the deployment script:
```
sh deploy-prod.sh
```

*Optional:* set the environment variable `$PORT` to change the server port (defaults to 8080):
```
PORT=8080 sh deploy-prod.sh
```
