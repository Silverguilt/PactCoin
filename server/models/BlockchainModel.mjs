import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  amount: Number,
  sender: String,
  recipient: String,
});

const blockSchema = new mongoose.Schema({
  timestamp: Number,
  lastHash: String,
  hash: String,
  index: Number,
  data: [transactionSchema],
});

const blockchainSchema = new mongoose.Schema({
  chain: [blockSchema],
  pendingTransactions: [transactionSchema],
});

const BlockchainModel = mongoose.model('Blockchain', blockchainSchema);

export default BlockchainModel;
