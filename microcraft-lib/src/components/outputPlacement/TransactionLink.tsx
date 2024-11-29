import React from 'react';

interface TransactionLinkProps {
  data: {
    type?: string; 
    value: string; 
    baseUrl?: string;  
  };
}

const TransactionLink: React.FC<TransactionLinkProps> = ({ data }) => {
  console.log("TransactionLink data", data);
  const { type, value, baseUrl } = data;

  let displayText = value;
  let linkUrl = '#';

  // Determine the link URL based on the type
  if (type === 'transaction') {
    linkUrl = baseUrl ? `${baseUrl}/tx/${value}` : value; // Transaction link
  } else if (type === 'address') {
    linkUrl = baseUrl ? `${baseUrl}/address/${value}` : value; // Address link
  } else {
    // If type is not provided or is invalid, treat value as a complete link
    linkUrl = value; // Use the provided value as the link
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
            <span>{displayText}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </>
      ) : (
        <span className="text-gray-500 cursor-not-allowed font-medium">Link Not Available</span>
      )}
    </div>
  );
};

export default TransactionLink;