import React, { useState, useEffect } from 'react';

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
    // If type is not provided or is invalid, treat value as a complete link
    linkUrl = trimmedValue; // Use the provided value as the link
  }

  // Function to check the transaction confirmation status
  const checkTransactionStatus = async () => {
    try {
      const response = await fetch(`${trimmedBaseUrl}/api/txstatus/${trimmedValue}`);
      const data = await response.json();

      if (data?.status === 'confirmed') {
        setIsConfirmed(true); // Transaction confirmed
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error checking transaction status:', error);
      setIsConfirmed(false); // Handle error if unable to fetch status
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConfirmed !== true) {
      const interval = setInterval(() => {
        checkTransactionStatus(); // Check status every 5 seconds
      }, 5000);

      // Clean up the interval when the transaction is confirmed or when the component is unmounted
      return () => clearInterval(interval);
    }
  }, [isConfirmed]);

  // Display messages based on transaction status
  let statusMessage = '';
  if (isLoading) {
    statusMessage = 'Checking confirmation...';
  } else if (isConfirmed) {
    statusMessage = 'Transaction Confirmed!';
  } else if (isConfirmed === false) {
    statusMessage = 'Transaction Failed or Not Found';
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
            {/* <span>{displayText}</span> */}
            <span>{linkUrl}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          {isLoading ? (
            <div className="text-sm text-gray-500">Checking transaction...</div>
          ) : (
            <div className={`text-sm ${isConfirmed ? 'text-green-500' : 'text-red-500'}`}>{statusMessage}</div>
          )}
        </>
      ) : (
        <span className="text-gray-500 cursor-not-allowed font-medium">Link Not Available</span>
      )}
    </div>
  );
};

export default TransactionLink;
