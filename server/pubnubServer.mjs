import PubNub from 'pubnub';

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
  NODES: 'NODES',
};

const credentials = {
  publishKey: process.env.PUBNUB_PUBLISH_KEY,
  subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
  secretKey: process.env.PUBNUB_SECRET_KEY,
  userId: 'dev-user',
};

class PubNubServer {
  constructor({ blockchain, nodePort }) {
    this.blockchain = blockchain;
    this.nodePort = nodePort;
    this.pubnub = new PubNub(credentials);
    this.nodes = [];

    this.subscribeChannels();
    this.addListener();
    setTimeout(() => {
      this.broadcastNodeDetails();
      this.broadcast();
    }, 1000);
  }

  broadcastNodeDetails() {
    const portMessage = { address: this.nodePort };
    this.pubnub
      .publish({
        channel: CHANNELS.NODES,
        message: JSON.stringify(portMessage),
      })
      .then(() =>
        console.log('Successfully broadcasted node details:', portMessage)
      )
      .catch((err) =>
        console.error(`Failed to publish nodes data, error: ${err}`)
      );
  }

  getNodes() {
    return this.nodes;
  }

  broadcast() {
    this.pubnub
      .publish({
        channel: CHANNELS.BLOCKCHAIN,
        message: JSON.stringify(this.blockchain.chain),
      })
      .then(() =>
        console.log(
          'Successfully published blockchain data:',
          this.blockchain.chain
        )
      )
      .catch((err) =>
        console.error(`Failed to publish blockchain data, error: ${err}`)
      );
  }

  subscribeChannels() {
    this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
    console.log('Successfully subscribed to channels');
  }

  addListener() {
    this.pubnub.addListener({
      message: (msgObj) => {
        this.handleMsg(msgObj);
      },
    });
    console.log('Listener added successfully');
  }

  handleMsg(msgObj) {
    const { channel, message } = msgObj;
    const parsedMessage = JSON.parse(message);

    console.log(`Received message on channel ${channel}:`, parsedMessage);

    if (channel === CHANNELS.BLOCKCHAIN) {
      this.blockchain.updateChain(parsedMessage);
      console.log('Blockchain updated with received data');
    } else if (channel === CHANNELS.NODES) {
      this.addNode(parsedMessage);
    }
  }

  addNode(node) {
    const exists = this.nodes.find((n) => n.address === node.address);
    if (!exists) {
      this.nodes.push(node);
      console.log(`Added new node: ${node.address}`);
    } else {
      console.log(`Node ${node.address} already exists`);
    }
  }
}

export default PubNubServer;
