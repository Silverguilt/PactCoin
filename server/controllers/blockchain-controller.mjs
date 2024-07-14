import { blockchain, pubnub } from '../server.mjs';
import { REWARD, MINER_ADDRESS } from '../config/config.mjs';

// Function to list all blocks and pending transactions
export const listBlocks = (req, res) => {
  try {
    res.status(200).json({
      data: {
        chain: blockchain.chain,
        pendingTransactions: blockchain.pendingTransactions,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to get a specific block by its index
export const getBlock = (req, res) => {
  const { index } = req.params;

  // Find the block by index
  const block = blockchain.chain.find((block) => block.index === +index);

  if (block) {
    res.status(200).json({ data: block });
  } else {
    res.status(404).json({ error: 'Block not found' });
  }
};

// Function to get the last block in the chain
export const getLastBlock = (req, res) => {
  try {
    const lastBlock = blockchain.chain[blockchain.chain.length - 1];
    res.status(200).json({ data: lastBlock });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to add a new block to the chain and reward the miner
export const addBlock = (req, res) => {
  try {
    const minerAddress = req.body.minerAddress || MINER_ADDRESS;

    // Add the block to the chain
    const newBlock = blockchain.addBlock();

    res.status(201).json({ data: newBlock });

    // Broadcast the new block to all nodes
    pubnub.broadcast();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to get the balance of a specific address
export const getBalance = (req, res) => {
  const { address } = req.params;
  let balance = 0;

  try {
    blockchain.chain.forEach((block) => {
      block.data.forEach((transaction) => {
        if (transaction.recipient === address) {
          balance += transaction.amount;
        }
        if (transaction.sender === address) {
          balance -= transaction.amount;
        }
      });
    });

    res.status(200).json({ balance });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
