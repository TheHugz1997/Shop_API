// Import express
const express = require('express');

// Initialize the app
const app = express();

const cors = require('cors');

app.use(express.json());

require('dotenv').config();

// Import Cassandra db
const cassandra = require('cassandra-driver');

// cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(cors());

let router = require('./routes');
app.use("/", router);

const ProductsModel = require('./models/productsModel');
const CategoriesModel = require('./models/categoriesModel');
const BasketModel = require('./models/basketModel');

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
        await BasketModel.createTable(client);
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

/*
    *********************************************
    ****COMMUNCATION WITH OTHER MICROSERVICES****
    *********************************************
*/

// // Function to make requests to other microservices
// async function makeMicroserviceRequest(microservice, endpoint, method = 'GET', data = {}) {
//     const microservicePortMap = {
//         stock: 30015,
//         users: 30019,
//         payment: 30021,
//     };

//     const microservicePort = microservicePortMap[microservice];

//     const url = `http://localhost:${microservicePort}/${endpoint}`;

//     try {
//         const response = await axios({
//             method,
//             url,A                                                
//             data,
//         });

//         return response.data;
//     } catch (error) {
//         console.error(`Error making ${method} request to ${microservice} microservice:`, error.message);
//         throw error;
//     }
// }

// // Example usage:
// app.get('/getStockData', async (req, res) => {
//     try {
//         const stockData = await makeMicroserviceRequest('stock', 'getStockData');
//         res.json(stockData);
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// // ... (define similar routes for other microservices)

// // Start the server
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });