// Import express
const express = require('express');

// Initialize the app
const app = express();

app.use(express.json());

require('dotenv').config();

// Import Cassandra db
const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
    contactPoints: ['127.0.0.1'],
    localDataCenter: 'datacenter1', 
    keyspace: 'shop_ecamazon2',
    protocolOptions: { port: 9042 }
});

// Connection to the cassandra cluster
client.connect()
  .then(() => {
    console.log('Connected to Cassandra cluster');
  })
  .catch((err) => {
    console.error('Error connecting to Cassandra:', err);
});

// cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

let router = require('./routes');
app.use("/", router);
  
const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

