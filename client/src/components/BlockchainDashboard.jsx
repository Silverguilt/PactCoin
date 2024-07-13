// components/BlockchainDashboard.jsx
import React, { useEffect, useState } from 'react';
import Dropdown from './Dropdown';
import SearchBar from './SearchBar';
import TxForm from './TxForm';
import { getBlockchain, getNodes, addBlockchain } from '../services/obscoinApi';
import { renderBlockchain, renderPendingTransactions } from './TxList';

function BlockchainDashboard() {
  const [blockchain, setBlockchain] = useState({});
  const [blockchainList, setBlockchainList] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [dynamicPort, setDynamicPort] = useState('');
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNodes();
  }, [nodes]);

  useEffect(() => {
    if (dynamicPort) {
      fetchBlockchain(dynamicPort);
    }
  }, [dynamicPort, loading]);

  useEffect(() => {
    if (blockchain && blockchain.data && Array.isArray(blockchain.data.chain)) {
      console.log('Blockchain chain data:', blockchain.data.chain); // Add this line
      setBlockchainList(blockchain.data.chain);
      setPendingTransactions(blockchain.data.pendingTransactions || []);
    }
  }, [blockchain]);

  const fetchNodes = async () => {
    try {
      const fetchedNodes = await getNodes();
      setNodes(fetchedNodes);
      if (fetchedNodes.length > 0) {
        const firstNodeAddress = fetchedNodes[0].address;
        setDynamicPort(firstNodeAddress);
      }
    } catch (err) {
      console.error(`Error fetching nodes: ${err}`);
    }
  };

  const fetchBlockchain = async (port) => {
    try {
      const blockchainData = await getBlockchain(port);
      console.log('Fetched blockchain data:', blockchainData); // Add this line
      setBlockchain(blockchainData);
    } catch (err) {
      console.error(`Error fetching blockchain: ${err}`);
    }
  };

  const handleMine = async () => {
    setLoading(true);
    try {
      const result = await addBlockchain(dynamicPort);
    } catch (err) {
      console.error('Error while mining:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <Dropdown
        nodes={nodes}
        setDynamicPort={setDynamicPort}
      />
      <SearchBar dynamicPort={dynamicPort} />
      <TxForm
        fetchBlockchain={fetchBlockchain}
        dynamicPort={dynamicPort}
      />
      {pendingTransactions.length > 0 ? (
        <button
          onClick={handleMine}
          disabled={loading}
        >
          {loading ? 'Mining ...' : 'Mine pending transactions'}
        </button>
      ) : (
        'No Pending Transactions'
      )}
      <div className="transactions-wrapper">
        {pendingTransactions.length > 0 ? (
          <>
            <h3 className="tx-header">Pending Transactions</h3>
            <ul className="pending-transactions">
              {renderPendingTransactions(pendingTransactions)}
            </ul>
          </>
        ) : null}
        {blockchainList.length > 0 ? (
          <ul>{renderBlockchain(blockchainList)}</ul>
        ) : (
          <p>No blockchain</p>
        )}
      </div>
    </div>
  );
}

export default BlockchainDashboard;
