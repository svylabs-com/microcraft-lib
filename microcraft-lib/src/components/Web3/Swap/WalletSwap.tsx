import React, { useState, useEffect } from "react";
import TokensDropdown from "./TokensDropdown";

interface Props {
  configurations: any;
  onSwapChange: any;
}

const Swap: React.FC<Props> = ({ configurations, onSwapChange }) => {
  const [currentTrade, setCurrentTrade] = useState({ from: null, to: null });
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  const selectToken = (side: string, token: any) => {
    const updatedTrade = { ...currentTrade, [side]: token };
    setCurrentTrade(updatedTrade);
    if (side === "from") setFromAmount("");
    if (side === "to") setToAmount("");
  };

  useEffect(() => {
    const swapData = { from: currentTrade.from, to: currentTrade.to, fromAmount, toAmount };
    onSwapChange(swapData);
  }, [currentTrade.from, currentTrade.to, fromAmount, toAmount]);

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromAmount(e.target.value);
    // getPrice();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-md p-4 lg:px-6">
        <h4 className="text-lg font-semibold mb-4">Swap</h4>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4">
            <label className="block text-gray-700">From Token</label>
            <TokensDropdown
              tokens={configurations.tokens}
              selectedToken={currentTrade.from}
              onSelect={(token) => selectToken("from", token)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Amount</label>
            <input
              type="number"
              value={fromAmount}
              onChange={handleFromAmountChange}
              className="block w-full mt-1 border rounded py-2 px-3"
              placeholder="Enter amount"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4">
            <label className="block text-gray-700">To Token</label>
            <TokensDropdown
              tokens={configurations.tokens}
              selectedToken={currentTrade.to}
              onSelect={(token) => selectToken("to", token)}
              blurToken={currentTrade.from}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Estimated Amount</label>
            <input
              type="text"
              value={toAmount}
              readOnly
              className="block w-full mt-1 border rounded py-2 px-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
