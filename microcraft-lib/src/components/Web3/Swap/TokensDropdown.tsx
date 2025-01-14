import React, { useState, useEffect, useRef } from "react";

interface Token {
  chainId: string | number;
  address: string;
  symbol: string;
  logoURI: string;
}

interface TokensDropdownProps {
  context: any;
  tokens: Token[];
  selectedToken: Token | null;
  onSelect: (token: Token) => void;
  blurToken?: Token | null;
}

const TokensDropdown: React.FC<TokensDropdownProps> = ({
  context,
  tokens,
  selectedToken,
  onSelect,
  blurToken,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTokens, setFilteredTokens] = useState<Token[] | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setIsOpen]);

  const handleSelect = (token: Token) => {
    onSelect(token);
    setIsOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    let filteredTokens = tokens?.filter((token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    filteredTokens = filteredTokens?.filter((token) => (token.chainId === context.chainId));
    setFilteredTokens(filteredTokens);
  }, [context]);

  

  return (
    <div ref={modalRef} className="relative">
      <button
        type="button"
        className="block w-full md:w-48 mt-1 border rounded py-2 px-3 bg-white text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedToken ? (
          <div className="flex items-center">
            <img
              src={selectedToken.logoURI}
              alt={selectedToken.symbol}
              className="w-6 h-6 mr-2"
            />
            {selectedToken.symbol}
          </div>
        ) : (
          "Select a token"
        )}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 h-64 overflow-scroll bg-white border rounded shadow-lg">
          <div className="sticky top-0 bg-white p-1 border-b">
            <input
              type="text"
              className="w-full p-2"
              placeholder="Search token"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {filteredTokens?.map((token) => (
            <div
              key={token.address}
              className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 ${blurToken && token.address === blurToken.address ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() =>
                !blurToken || token.address !== blurToken.address
                  ? handleSelect(token)
                  : null
              }
            >
              <img
                src={token.logoURI}
                alt={token.symbol}
                className="w-6 h-6 mr-2"
              />
              {token.symbol}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TokensDropdown;
