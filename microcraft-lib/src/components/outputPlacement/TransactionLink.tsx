import React from 'react';

interface TransactionLinkProps {
  data: any;
}

const TransactionLink: React.FC<TransactionLinkProps> = ({ data }) => {
  console.log("TRANSACTION link Data", data);
  const txHash = data || '';
  const etherscanUrl = txHash ? `https://etherscan.io/tx/${txHash}` : '#';

  return (
    <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-md shadow-md max-w-md">
      {txHash ? (
        <>
          <span className="text-gray-700 font-medium">View Transaction on Etherscan:</span>
          <a 
            href={etherscanUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:text-blue-700 underline font-semibold transition duration-150 ease-in-out flex items-center"
          >
            <span>{`${txHash.slice(0, 10)}...`}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </>
      ) : (
        <span className="text-gray-500 cursor-not-allowed font-medium">Transaction Not Available</span>
      )}
    </div>
  );
};

export default TransactionLink;
