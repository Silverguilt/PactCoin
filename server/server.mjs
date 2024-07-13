import express from 'express';
import cors from 'cors';
import Blockchain from './models/Blockchain.mjs';
import PubNubServer from './pubnubServer.mjs';
import blockchainRouter from './routes/blockchain-routes.mjs';
import txRouter from './routes/tx-routes.mjs';
import pubnubRouter from './routes/pubnub-routes.mjs';
import authRoutes from './routes/auth-routes.mjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const PORT = +process.env.PORT || 5010;
const PRIMARY_NODE = `http://localhost:${PORT}`;

let nodePort =
  process.env.DYNAMIC_NODE_PORT === 'true'
    ? PORT + Math.floor(Math.random() * 1000)
    : PORT;

let blockchain;
let pubnub;

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Define routes
app.use('/api/v1/obscoin/blockchain', blockchainRouter);
app.use('/api/v1/obscoin/transactions', txRouter);
app.use('/api/v1/obscoin/nodes', pubnubRouter);
app.use('/api/auth', authRoutes);

// Function to synchronize the blockchain with the primary node
const syncBlockchain = async () => {
  try {
    const response = await fetch(`${PRIMARY_NODE}/api/v1/obscoin/blockchain`);

    if (response.ok) {
      const { data } = await response.json();
      blockchain.updateChain(data.chain); // Ensure to update with chain data
    } else {
      throw new Error('Failed to sync blockchain: Server response not OK');
    }
  } catch (error) {
    console.error(`Failed to sync blockchain: ${error.message}`);
  }
};

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Options no longer needed
    });
    console.log('MongoDB connected...');

    // Initialize blockchain and pubnub after successful DB connection
    blockchain = new Blockchain();
    pubnub = new PubNubServer({ blockchain, nodePort });

    // Broadcast the initial state of the blockchain
    setTimeout(() => {
      pubnub.broadcast();
    }, 1000);
    pubnub.getNodes();

    // Start the server
    app.listen(nodePort, () => {
      console.log(`Server is running on port: ${nodePort}`);

      if (nodePort !== PORT) {
        syncBlockchain();
      }
    });
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

export { blockchain, pubnub };
