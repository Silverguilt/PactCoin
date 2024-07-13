import { v4 as uuid4 } from 'uuid';
import mongoose from 'mongoose';

// Define the Mongoose schema
const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },
  txId: {
    type: String,
    required: true,
    unique: true,
  },
});

// Create the Mongoose model
export const TransactionModel = mongoose.model(
  'Transaction',
  transactionSchema
);

export default class Transaction {
  constructor(details) {
    // Validate transaction details
    if (!details.amount || !details.sender || !details.recipient) {
      throw new Error('Transaction details are incomplete');
    }

    this.amount = details.amount;
    this.sender = details.sender;
    this.recipient = details.recipient;
    this.txId = this.generateTxId();
  }

  // Function to generate a unique transaction ID
  generateTxId() {
    return uuid4().replaceAll('-', '');
  }

  // Function to save the transaction to MongoDB
  async save() {
    const transaction = new TransactionModel({
      amount: this.amount,
      sender: this.sender,
      recipient: this.recipient,
      txId: this.txId,
    });

    try {
      await transaction.save();
      console.log('Transaction saved to MongoDB');
    } catch (error) {
      console.error('Error saving transaction to MongoDB:', error);
    }
  }
}
