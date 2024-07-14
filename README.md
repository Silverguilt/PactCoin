## PactCoin

PactCoin is a blockchain application that implements a simple cryptocurrency system. It includes features such as transaction handling, block creation, blockchain synchronization across nodes, and data persistence with MongoDB.

## Features

- **Blockchain**: A fully functional blockchain with the ability to add blocks, manage transactions, and synchronize real-time between nodes using PubNub.
- **Transactions**: Create and manage transactions, including mining rewards. View transaction history by searching the transaction Id.
- **Persistence**: Blockchain, blocks, transactions and users are saved in a MongoDB database.
- **Node Communication**: Nodes communicate using PubNub for broadcasting updates and discovering new nodes.
- **REST API**: Exposes API endpoints for interacting with the blockchain and transactions.
- **React Frontend** Client-side routing with React Router

## Packages

- Backend:

  - bcryptjs
  - cors
  - crypto-js
  - dotenv
  - express
  - express-validator
  - jsonwebtoken
  - mongoose
  - sha256
  - uuid
  - cross-env
  - jest
  - nodemon
  - pubnub

- Frontend:
  - react
  - react-dom
  - react-router-dom
  - vite
  - eslint
  - @vitejs/plugin-react
  - eslint-plugin-react
  - eslint-plugin-react-hooks
  - eslint-plugin-react-refresh

## Installation and usage

To install and run the application locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/silverguilt/pactcoin.git

   ```

2. Install dependencies

   - Backend

     ```bash
      cd server
      npm install

     ```

   - Frontend

     ```bash
     cd client
     npm install

     ```

3. Configure Environment Variables

- Create a .env file in the server/config directory.
- Add the following environment variables to the .env file:

  ```bash
        PUBNUB_PUBLISH_KEY=yourkey
        PUBNUB_SUBSCRIBE_KEY=yourkey
        PUBNUB_SECRET_KEY=yourkey
        PORT=5010
        DYNAMIC_NODE_PORT=true
        JWT_SECRET=yourkey
        MONGO_URI=yourmongoURI

  ```

4.  Run project

    - To run the backend server with port 5010

      ```bash
      cd server
      npm run dev

      ```

    - To run backend server with dynamic port

      ```bash
      cd server
      npm run dev-node

      ```

    - To run frontend
      ```bash
      cd client
      npm run dev
      ```

## Troubleshooting

- Ensure MongoDB is running and accessible via the URI specified in the .env file.
- Verify PubNub keys are correctly set up in the .env file.
- Check logs for any errors during server startup and operation.

## Contributors

This project was an individual assignment, but is based upon a group project called Obscoin. The following people contributed to the original project:

- Sebastian Flavet
- Nathalie Persson Enriquez
- Igor Ristic
- Gert Ove Jacobsson
