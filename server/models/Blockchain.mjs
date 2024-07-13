import Transaction from './Transaction.mjs';
import computeHash from '../utils/crypto-lib.mjs';
import Block from '../models/Block.mjs';
import BlockchainModel from '../models/BlockchainModel.mjs';
import { REWARD, MINER_ADDRESS } from '../config/config.mjs'; // Import mining reward and miner address

const GENESIS_BLOCK = {
  timestamp: 1,
  lastHash: '0',
  hash: '0',
  index: 0,
  data: [
    {
      amount: 0,
      recipient: 'Genesis Block',
      sender: 'Genesis Block',
    },
  ],
};

export default class Blockchain {
  constructor() {
    this.chain = [GENESIS_BLOCK];
    this.pendingTransactions = [];
    this.loadBlockchain();
  }

  async loadBlockchain() {
    try {
      const blockchain = await BlockchainModel.findOne();
      if (blockchain) {
        this.chain = blockchain.chain;
        this.pendingTransactions = blockchain.pendingTransactions;
      } else {
        await this.saveBlockchain();
      }
    } catch (error) {
      console.error('Failed to load blockchain from MongoDB:', error);
    }
  }

  async saveBlockchain() {
    try {
      let blockchain = await BlockchainModel.findOne();
      if (blockchain) {
        blockchain.chain = this.chain;
        blockchain.pendingTransactions = this.pendingTransactions;
      } else {
        blockchain = new BlockchainModel({
          chain: this.chain,
          pendingTransactions: this.pendingTransactions,
        });
      }
      await blockchain.save();
    } catch (error) {
      console.error('Failed to save blockchain to MongoDB:', error);
    }
  }

  // Add a new block to the blockchain
  async addBlock() {
    const latestBlock = this.getLatestBlock();
    const timestamp = Date.now();
    const lastHash = latestBlock.hash;
    const index = latestBlock.index + 1;
    const data = [...this.pendingTransactions];

    // Include the mining reward transaction
    const rewardTransaction = new Transaction({
      amount: REWARD,
      sender: 'system',
      recipient: MINER_ADDRESS, // Replace with the actual miner address
    });
    data.push(rewardTransaction);

    const newBlock = new Block({
      timestamp,
      lastHash,
      index,
      data,
    });

    this.chain.push(newBlock);
    this.pendingTransactions = []; // Clear the transaction pool

    await this.saveBlockchain();

    return newBlock;
  }

  // Get the latest block in the chain
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  // Create a new transaction
  initTx(details) {
    return new Transaction(details);
  }

  // Add a new transaction to the pool
  addNewTx(transaction) {
    this.pendingTransactions.push(transaction);
    return this.getLatestBlock().index + 1;
  }

  // List all transactions in the blockchain
  listAllTx() {
    return this.chain.flatMap((block) => block.data);
  }

  // Update the blockchain with a new chain if valid
  async updateChain(newChain) {
    if (
      newChain.length <= this.chain.length ||
      !Blockchain.isValidChain(newChain)
    ) {
      return;
    }

    this.chain = newChain;
    await this.saveBlockchain();
  }

  // Validate the new chain
  static isValidChain(newChain) {
    if (
      newChain.length === 0 ||
      JSON.stringify(newChain[0]) !== JSON.stringify(GENESIS_BLOCK)
    ) {
      return false;
    }

    for (let i = 1; i < newChain.length; i++) {
      const { index, lastHash, timestamp, hash, data } = newChain[i];
      const newChainLastHash = newChain[i - 1].hash;

      if (lastHash !== newChainLastHash) {
        return false;
      }

      const validatedHash = computeHash(
        index,
        lastHash,
        timestamp.toString(),
        JSON.stringify(data)
      );
      if (hash !== validatedHash) {
        return false;
      }
    }

    return true;
  }
}
