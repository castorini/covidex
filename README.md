# COVID-19 Open Research Dataset Search

This repository contains the API server and UI client for searching the [COVID-19 Open Research Dataset (CORD-19)](https://pages.semanticscholar.org/coronavirus-research).

#### Local Deployment

To run the API server, follow the instructions in [api/README.md](./api/README.md).

To run the UI client, follow the instructions in [client/README.md](./client/README.md).

#### Production Deployment

Redirect port 80 to a specified port since only root can bind to port 80 (the below command uses port 8000):
```
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8000
```

Run the deployment script to start the server and warm up models (deploys to port 8000 by default):
```
sh deploy-prod.sh
```

*Optional:* set the environment variable `$PORT`:
```
PORT=8000 sh deploy-prod.sh
```
