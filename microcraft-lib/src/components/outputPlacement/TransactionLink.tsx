import React from 'react';

interface TransactionLinkProps {
  data: any;
}

const TransactionLink: React.FC<TransactionLinkProps> = ({ data }) => {
  const txHash = data || '';

  const etherscanUrl = txHash ? `https://etherscan.io/tx/${txHash}` : '#';

  return (
    <a href={etherscanUrl} target="_blank" rel="noopener noreferrer">
      {txHash ? `${txHash.slice(0, 10)}...` : 'Transaction not available'}
    </a>
  );
};

export default TransactionLink;
