import React, { useState, useEffect } from "react";
// import { StargateClient } from "@cosmjs/stargate";
import { StargateClient, Account } from "@cosmjs/stargate";

interface WalletBalanceProps {
  address: string;
  networkType: string;
  onUpdateBalance: any; //del
}

const WalletBalance: React.FC<WalletBalanceProps> = ({
  address,
  networkType,
  onUpdateBalance, //del
}) => {
  const [ethBalance, setEthBalance] = useState<number | null>(null);
  const [minaBalance, setMinaBalance] = useState<number | null>(null);
  const [keplrBalance, setKeplrBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalances = async () => {
      if (networkType === "ethereum") {
        const ethBalance = await fetchEthBalance(address);
        setEthBalance(ethBalance);
        onUpdateBalance(ethBalance);  //del
      } else if (networkType === "mina") {
        const minaBalance = await fetchMinaBalance(address);
        setMinaBalance(minaBalance);
        onUpdateBalance(minaBalance); //del
      } else if (networkType === "keplr") {
        const keplrBalance = await fetchKeplrBalance(address);
        setKeplrBalance(keplrBalance);
      }
    };

    fetchBalances();
  }, [address, networkType]);

  const fetchEthBalance = async (address: string) => {
    const balanceResult = await window.ethereum.request({
      method: "eth_getBalance",
      params: [address, "latest"],
    });
    console.log("Balance:", balanceResult + " wei");
    // Convert wei to decimal
    const wei = parseInt(balanceResult, 16);
    const balance = wei / 10 ** 18;
    console.log("Balance:", balance + " ETH");
    return balance;
  };

  const fetchMinaBalance = async (address: string) => {
    // Implementation to fetch Mina balance
    return null;
  };

  const fetchKeplrBalance = async (address: string) => {
    // Implementation to fetch keplr balance
    return null;
  };

  // const fetchKeplrBalance = async (address: string) => {
  //   try {
  //     const client = await StargateClient.connect("https://rpc.cosmos.network");
  //     const account = await client.getAccount(address);
  //     const balance = [{ amount: "0", denom: "uatom" }];
  //     // const balance = account?.balance || [{ amount: "0", denom: "uatom" }];
  //     const amount = parseFloat(balance[0].amount) / 10 ** 6; // Convert from uatom to ATOM
  //     return amount;
  //   } catch (error) {
  //     console.error("Error fetching Keplr balance:", error);
  //     return null;
  //   }
  // };


  return (
    <div className="flex justify-end items-center mt-2 text-gray-700 font-medium">
      {networkType === "ethereum" && (
        <>
          {ethBalance !== null
            ? `ETH Balance: ${ethBalance}`
            : "Fetching ETH balance..."}
        </>
      )}
      {networkType === "mina" && (
        <>
          {minaBalance !== null
            ? `MINA Balance: ${minaBalance}`
            : "Fetching MINA balance..."}
        </>
      )}
      {networkType === "keplr" && (
        <>
          {keplrBalance !== null
            ? `KEPLR Balance: ${keplrBalance}`
            : "Fetching KEPLR balance..."}
        </>
      )}
    </div>
  );
};

export default WalletBalance;