import Transaction from '../models/Transaction.mjs';
import { blockchain } from '../server.mjs';
import mongoose from 'mongoose';

const TransactionModel = mongoose.model('Transaction');

// Create a new transaction
export const createTx = async (req, res, next) => {
  const { amount, sender, recipient } = req.body;

  if (!amount || !sender || !recipient) {
    return res
      .status(400)
      .json({ error: 'Transaction details are incomplete' });
  }

  try {
    const newTx = new Transaction({ amount, sender, recipient });

    // Save the transaction to MongoDB
    await newTx.save();

    // Add the transaction to the blockchain
    blockchain.addNewTx(newTx);

    res.status(201).json(newTx);
  } catch (error) {
    next(error);
  }
};

// Get a transaction by ID
export const getTxById = async (req, res, next) => {
  const { txId } = req.params;

  try {
    const transaction = await TransactionModel.findOne({ txId });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error); // Log the error
    next(error);
  }
};

// Get all transactions
export const getAllTx = async (req, res, next) => {
  try {
    const transactions = await TransactionModel.find();
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error); // Log the error
    next(error);
  }
};
