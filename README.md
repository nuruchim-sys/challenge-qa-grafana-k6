# Demo of Performace Testing with Grafana k6

### Prerequisites
Here we will describe the versions of dependencies, packages, or other technologies that need to be configured on the local machine.
- Docker Desktop or Docker Engine installed and running
- A code editor like VS Code 
- Note: No local installation of Node.js or k6 is required.

### Folder Structure
```
GRAFANA-K6-PROJECT/
├── node_modules/
├── scripts/
│   ├── api.js
│   └── main.js
├── data.csv
├── package.json
└── README.md
```
`scripts/main.js`:  The main test file where scenarios (TPS), thresholds, and data import are configured.

`scripts/api.js`: Encapsulated API client that handles HTTP requests (validation of status 201).

`data.csv`: File containing user credentials that k6 will dynamically use during the test.

### Steps

Start the container
```bash
docker compose up -d --build
```

Open an interactive shell
```bash
docker exec -it grafana-k6 sh
```

Run the script
```bash
k6 run scripts/main.js
```

### Video
See the configuration setup tutorial [here](https://drive.google.com/file/d/1Hc6GbiNe3AXiv1VW-rd-_IuwyofInmII/view?usp=drive_link).