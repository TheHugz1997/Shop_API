# Shop API

Shop API is a Node.js application that provides a backend for an e-commerce platform. It's using Cassandra as the database to store product and category information.

## Features

- **Express.js Server:** The application is built on top of the Express.js framework, providing a robust and scalable server.

- **Cassandra Database:** Shop API uses Cassandra as the database to store and retrieve product, category, and basket information.

## Prerequisites

Before running the application, ensure you have the following installed:

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd Shop_API

2. Build and run the container:

    ```bash
    docker-compose up --build

## Docker Compose Configuration

The Docker Compose file (`docker-compose.yml`) defines the services and their configurations for orchestrating the Shop API application and Cassandra database using Docker containers.

### Services

#### 1. `nodejs-app`

- **Build Configuration:**
  - `context`: Specifies the build context, which is the root directory of the application.
  - `dockerfile`: Specifies the Dockerfile used for building the Node.js app container.

- **Image Configuration:**
  - `image`: Specifies the name of the Docker image for the Node.js app.
  - `container_name`: Specifies the name of the Docker container for the Node.js app.
  - `ports`: Maps the port `3200` on the host to the port `3200` on the container.
  - `depends_on`: Ensures the `cassandra` service is started before the Node.js app.

- **Environment Variables:**
  - `NODE_ENV=production`: Sets the Node.js environment to production.

#### 2. `cassandra`

- **Image Configuration:**
  - `image`: Specifies the name of the Docker image for Cassandra.
  - `container_name`: Specifies the name of the Docker container for Cassandra.
  - `ports`: Maps the port `9042` on the host to the port `9042` on the container.

- **Environment Variables:**
  - `CASSANDRA_SEEDS=cassandra`: Specifies the seed node for Cassandra.
  - `CASSANDRA_CLUSTER_NAME=ShopCluster`: Sets the Cassandra cluster name.
  - `CASSANDRA_KEYSPACE=shop_ecamazon2`: Specifies the keyspace for the application.
  - `CASSANDRA_DC=datacenter1`: Sets the data center configuration for Cassandra.

### Networks

- `app-network`: Configures the bridge network for communication between the Node.js app and Cassandra containers.

### Volumes

- `./my_cassandra_storage:/var/lib/cassandra`: Mounts the local directory `./my_cassandra_storage` to the Cassandra data directory.

### Usage

To build and run the Docker containers, use the following command:

```bash
docker-compose up --build

