import React, { useState, useEffect } from "react";
import BigNumber from "bignumber.js";
// import Web3 from "web3";
// import qs from "qs";
import TokensDropdown from "./TokensDropdown";
import { FiArrowDownCircle } from "react-icons/fi";
import Web3 from "web3";
import { MCComponentProps } from "../MCProps";
// const web3 = new Web3(Web3.givenProvider);

interface Props {
  configurations: any;
  onSwapChange: any;
  data: any;
  context: any;
}

const Swap: React.FC<Props> = ({ configurations, onSwapChange, data, context }) => {
  console.log("Swap configurations:- ", configurations, context);

  const fromTokens = configurations.tokens.filter((token: any) =>
    token.listType === "from" || token.listType === "both"
  );
  const toTokens = configurations.tokens.filter((token: any) =>
    token.listType === "to" || token.listType === "both"
  );

  const defaultFromToken = fromTokens[0] || null; // Set to the first token in fromTokens as default
  const defaultToToken = toTokens[0] || null; // Set to the first token in toTokens as default

  // const [currentTrade, setCurrentTrade] = useState({ from: null, to: null });
  const [currentTrade, setCurrentTrade] = useState({
    from: defaultFromToken,
    to: defaultToToken
  });
  const [fromAmount, setFromAmount] = useState("");
  // const [toAmount, setToAmount] = useState(data?.toAmount || "");
  const [toAmount, setToAmount] = useState("");
  const [maxBorrowAmount, setMaxBorrowAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // Initialize Web3 instance
  const web3 = new Web3(Web3.givenProvider);

  // Fetch user address and balance
  const fetchUserAddressAndBalance = async () => {  
    try {
      let address = "";
      let balance = "0";

      if (context.connected && window.ethereum) {
        // Ethereum wallet
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        address = accounts[0];
        console.log("ETHEREUM address:- ", address);
        const rawBalance = await web3.eth.getBalance(address);
        balance = web3.utils.fromWei(rawBalance.toString(), "ether"); // Convert to Ether and ensure it's a string
      } else if (context.connected && window.mina) {
        // Mina wallet
        const accounts = await window.mina.requestAccounts();
        address = accounts[0];
        console.log("Mina address:- ", address);
      } else if (context.connected && window.keplr) {
        // Keplr wallet (Cosmos-based)
        const chainId = "cosmoshub-4";
        await window.keplr.enable(chainId);
        const offlineSigner = window.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();
        address = accounts[0].address;
        console.log("KEPLR address:- ", address);
        const client = await window.getOfflineSigner(chainId);
        const balances = await client.getBalance(address, "uatom");
        balance = (balances?.amount / 1e6).toString();
      } else {
        console.warn("No supported wallet found.");
        return;
      }

      setMaxAmount(balance.toString());
      console.log("maxAmount", maxAmount);
    } catch (error) {
      console.error("Error fetching user address or balance:", error);
      setMaxAmount("null");
    }
  };

  useEffect(() => {
    fetchUserAddressAndBalance(); // Fetch once on component mount
  }, []);

  useEffect(() => {
    const currentTrade = {
      from: fromTokens.filter((token: any) => token.chainId === context.chainId)[0],
       to: toTokens.filter((token: any) => token.chainId === context.chainId)[0]
    }
    setCurrentTrade(currentTrade);
  }, [context]);

  useEffect(() => {
    fetchUserAddressAndBalance(); // Fetch again when currentTrade.from changes
  }, [currentTrade.from]);

  useEffect(() => {
    // Update toAmount based on data prop changes
    // if (data?.toAmount) {
    //   setToAmount(data.toAmount);
    // }

    const estimatedAmountKey = configurations?.estimatedAmountLabel;
    const borrowAmountKey = configurations?.maxEstimationBorrowLabel;

    // Update `toAmount` based on `estimatedAmountLabel` and `data`
    if (estimatedAmountKey && data && data[estimatedAmountKey]) {
      setToAmount(data[estimatedAmountKey]);
    }

    // Update `maxBorrowAmount` dynamically based on `maxEstimationBorrowLabel` and `data`
    if (borrowAmountKey && data && data[borrowAmountKey]) {
      setMaxBorrowAmount(data[borrowAmountKey]);
    }
  }, [configurations, data]);

  const selectToken = (side: "from" | "to", token: any) => {
    const updatedTrade = { ...currentTrade, [side]: token };
    setCurrentTrade(updatedTrade);
    if (side === "from") setFromAmount("");
    if (side === "to") setToAmount("");
  };

  useEffect(() => {
    // const swapData = { from: currentTrade.from, to: currentTrade.to, fromAmount, toAmount };

    // Access swapConfig values using user-defined labels as IDs
    const swapData = {
      [configurations?.fromTokenLabel]: currentTrade.from,
      [configurations?.toTokenLabel]: currentTrade.to,
      [configurations?.amountLabel]: fromAmount,
      [configurations?.estimatedAmountLabel]: toAmount,
      [configurations?.maxEstimationBorrowLabel]: maxBorrowAmount,
    };
    onSwapChange(swapData);
  }, [currentTrade.from, currentTrade.to, fromAmount, toAmount]);

  // const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFromAmount(e.target.value);
  // };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputAmount = e.target.value;

    // If the input is empty, just set the fromAmount to an empty string
    if (inputAmount === "") {
      setFromAmount("");
      return;
    }

    setFromAmount(inputAmount);
  };

  // console.log(tokens)
  // console.log(currentTrade);
  // console.log(currentTrade?.from?.address);
  // console.log(currentTrade?.to?.address);
  // console.log(fromAmount);

  return (
    <div className="container mx-auto p-6 border rounded shadow-sm">
      {/* <div className="mx-auto bg-gradient-to-br from-slate-500 to-slate-700 rounded-lg shadow-lg p-6"> */}
      <h4 className="text-lg lg:text-xl font-semibold mb-4 text-center">{configurations?.heading}</h4>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="mb-4 w-full md:w-1/2">
          <label className="block ">{configurations?.fromTokenLabel}</label>
          <TokensDropdown
            context={context}
            tokens={fromTokens}
            selectedToken={currentTrade.from}
            onSelect={(token) => selectToken("from", token)}
            blurToken={currentTrade.to}
          />
        </div>
        <div className="mb-4 w-full md:w-1/2">
          <label className="block ">{configurations?.amountLabel}</label>
          <input
            type="number"
            value={fromAmount}
            onChange={handleFromAmountChange}
            className="block w-full mt-1 border rounded py-2 px-3"
            placeholder="Enter amount"
            max={maxAmount}
          />
          <span className="text-sm mt-1 block">
            Max amount: {maxAmount}
          </span>
        </div>
      </div>
      <div className="flex justify-center">
        <FiArrowDownCircle size={30} className="animate-bounce" />
      </div>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="mb-4 w-full md:w-1/2">
          <label className="block ">{configurations?.toTokenLabel}</label>
          <TokensDropdown
            context={context}
            tokens={toTokens}
            selectedToken={currentTrade.to}
            onSelect={(token) => selectToken("to", token)}
            blurToken={currentTrade.from}
          />
        </div>
        <div className="mb-4 w-full md:w-1/2">
          <label className="block ">{configurations?.estimatedAmountLabel}</label>
          <input
            type="text"
            value={toAmount}
            onChange={(e) => setToAmount(e.target.value)}
            // readOnly
            // className="block w-full mt-1 border rounded py-2 px-3 bg-gray-100 text-indigo-700 cursor-not-allowed"
            className="block w-full mt-1 border rounded py-2 px-3"
            placeholder="Estimated amount"
          />
          <span className="text-sm mt-1 block">
            {configurations?.maxEstimationBorrowLabel}: {maxBorrowAmount || "N/A"}
          </span>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default Swap;
