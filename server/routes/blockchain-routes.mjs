import express from 'express';
import {
  addBlock,
  listBlocks,
  getBlock,
  getLastBlock,
  getBalance,
} from '../controllers/blockchain-controller.mjs';

const router = express.Router();

// Route to list all blocks and pending transactions
router.route('/').get(listBlocks);

// Route to get a specific block by its index
router.route('/block/:index').get(getBlock);

// Route to get the last block in the chain
router.route('/block/last').get(getLastBlock);

// Route to mine a new block
router.route('/mine').post(addBlock);

// Route to get the balance of a specific address
router.route('/balance/:address').get(getBalance);

export default router;
