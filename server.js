// Import express
const express = require('express');

// Initialize the app
const app = express();

app.use(express.json());

require('dotenv').config();

// Import Cassandra db
const cassandra = require('cassandra-driver');

// cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

let router = require('./routes');
app.use("/", router);

const ProductsModel = require('./models/productsModel');
const CategoriesModel = require('./models/categoriesModel');

const client = new cassandra.Client({
    contactPoints: ['127.0.0.1'],
    localDataCenter: 'datacenter1', 
    keyspace: 'shop_ecamazon2',
    protocolOptions: { port: 9042 }
});

// Set the Cassandra client in the app
app.set('cassandraClient', client);

// Connection to the Cassandra cluster
client.connect()
    .then(async () => {
        console.log('Connected to Cassandra cluster');

        // Create tables (ensure products and categories tables are created)
        await ProductsModel.createTable(client);
        await CategoriesModel.createTables(client);
    })
    .then(() => {
        // Start the server after ensuring tables are created
        const port = 3200;
        app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to Cassandra:', err);
});