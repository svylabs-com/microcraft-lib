import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

interface TransactionLinkProps {
  data: {
    type?: string;
    value: string;
    baseUrl?: string;
  };
}

const TransactionLink: React.FC<TransactionLinkProps> = ({ data }) => {
  const [isConfirmed, setIsConfirmed] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { type, value, baseUrl } = data;

  // Trim the data
  const trimmedType = type?.trim();
  const trimmedValue = value.trim();
  const trimmedBaseUrl = baseUrl?.trim();

  console.log("TransactionLink data", { type, trimmedValue, trimmedBaseUrl });

  let displayText = trimmedValue;
  let linkUrl = '#';

  // Determine the link URL based on the type
  if (trimmedType === 'transaction') {
    linkUrl = trimmedBaseUrl ? `${trimmedBaseUrl}/tx/${trimmedValue}` : trimmedValue;
  } else if (trimmedType === 'address') {
    linkUrl = trimmedBaseUrl ? `${trimmedBaseUrl}/address/${trimmedValue}` : trimmedValue;
  } else {
    linkUrl = trimmedValue;
  }

  // Function to check the transaction confirmation status using web3
  const checkTransactionStatus = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('No wallet detected. Please install a wallet like MetaMask.');
      }

      // Initialize Web3 with the injected provider
      const web3 = new Web3(window.ethereum);

      // Get the transaction receipt
      const receipt = await web3.eth.getTransactionReceipt(trimmedValue);

      if (receipt) {
        if (receipt.status) {
          setIsConfirmed(true); // Transaction confirmed
        } else {
          setIsConfirmed(false); // Transaction failed
        }
      } else {
        setIsConfirmed(null); // Transaction not yet mined
      }

      setIsLoading(false);
    } catch (error: any) {
      console.error('Error checking transaction status:', error);
      setErrorMessage(error.message || 'An error occurred while checking the transaction');
      setIsLoading(false);
      setIsConfirmed(false);
    }
  };

  useEffect(() => {
    if (type === 'transaction') {
      if (isConfirmed === null) {
        const interval = setInterval(() => {
          checkTransactionStatus(); // Check status every 12 seconds
        }, 12000);

        // Clean up the interval when the transaction is confirmed or the component is unmounted
        return () => clearInterval(interval);
      }
    }
  }, [isConfirmed]);

  // Display messages based on transaction status
  let statusMessage = '';
  if (isLoading) {
    statusMessage = 'Pending...';
  } else if (isConfirmed) {
    statusMessage = 'Confirmed!';
  } else if (errorMessage) {
    statusMessage = errorMessage; // Display specific error message
  } else {
    statusMessage = 'Not yet confirmed.';
  }

  return (
    <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-md shadow-md max-w-md">
      {displayText ? (
        <>
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline font-semibold transition duration-150 ease-in-out flex items-center"
          >
            {/* <span>{linkUrl}</span> */}
            <span>{displayText.length > 32 ? `${displayText.slice(0, 32)}...` : displayText}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          {/* <div className={`text-sm ${isConfirmed ? 'text-green-500' : 'text-red-500'}`}>{statusMessage}</div> */}
          {
          (type === 'transaction') && (
          <div
            className={`text-sm font-medium p-2 rounded-md mt-2 flex items-center justify-center transition-all duration-300 ${isConfirmed
              ? 'bg-green-100 text-green-600'
              : isConfirmed === false
                ? 'bg-red-100 text-red-600'
                : errorMessage
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-gray-100 text-gray-600'
              }`}
          >
            {statusMessage}
          </div>)
    }
        </>
      ) : (
        <span className="text-gray-500 cursor-not-allowed font-medium">Link Not Available</span>
      )}
    </div>
  );
};

export default TransactionLink;
