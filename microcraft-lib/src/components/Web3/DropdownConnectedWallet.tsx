import React, { useState, useEffect } from "react";
import WalletBalance from "./WalletBalance";
import { ChainInfo } from "@keplr-wallet/types";


interface DropdownConnectedWalletProps {
  configurations: any;
  onSelectAddress: (address: string) => void;
  onUpdateBalance: (balance: number) => void; //del
}


const getChainInfo = (config: any): ChainInfo => {
  const chainId = config?.config?.chainId || "cosmoshub-4";
  const rpcUrl = config?.config?.rpcUrl || "";
  return {
    chainId,
    chainName: config?.type || "Custom Chain",
    rpc: rpcUrl,
    rest: rpcUrl,
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "cosmos",
      bech32PrefixAccPub: "cosmospub",
      bech32PrefixValAddr: "cosmosvaloper",
      bech32PrefixValPub: "cosmosvaloperpub",
      bech32PrefixConsAddr: "cosmosvalcons",
      bech32PrefixConsPub: "cosmosvalconspub",
    },
    currencies: [
      {
        coinDenom: "STAKE",
        coinMinimalDenom: "stake",
        coinDecimals: 0,
        coinGeckoId: "stake",
      },
      {
        coinDenom: "TOKEN",
        coinMinimalDenom: "token",
        coinDecimals: 0,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "STAKE",
        coinMinimalDenom: "stake",
        coinDecimals: 0,
        coinGeckoId: "stake",
        gasPriceStep: {
          low: 1,
          average: 1,
          high: 1,
        },
      },
    ],
    stakeCurrency: {
      coinDenom: "STAKE",
      coinMinimalDenom: "stake",
      coinDecimals: 0,
      coinGeckoId: "stake",
    },
    features: [],
  };
};

const DropdownConnectedWallet: React.FC<DropdownConnectedWalletProps> = ({
  configurations,
  onSelectAddress,
  onUpdateBalance, //del
}) => {
  console.log(configurations)
  const [config, setConfig] = useState<any | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  // console.log(config?.config?.chainId)
  // console.log(config?.config?.rpcUrl)
  // console.log(config?.config?.exploreUrl)

  useEffect(() => {
    const parseConfigurations = (configurationsString: any) => {
      // Remove any bad control characters from the string
      const cleanedString = configurationsString.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
      try {
        setConfig(JSON.parse(cleanedString));
      } catch (error) {
        console.error("Error parsing configurations:", error);
      }
    };

    if (typeof configurations === "string") {
      parseConfigurations(configurations);
    } else if (typeof configurations === "object") {
      setConfig(configurations);
    } else {
      console.warn("Configurations are not a valid string or object.");
    }
  }, [configurations]);
  console.log("configurations:-> ", config)

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        // const networkType = config?.network?.type?.toLowerCase();
        const networkType = config?.type?.toLowerCase();

        if (!networkType) {
          console.error("Network type not specified in configurations.");
          return;
        }

        let address = "";

        if (networkType === "ethereum" && window.ethereum) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          address = accounts[0];
        } else if (networkType === "mina" && window.mina) {
          const accounts = await window.mina.requestAccounts();
          address = accounts[0];
        } else if (networkType === "keplr" && window.keplr) {
          const chainInfo = getChainInfo(config);

          // Enable the chain using chainId
          await window.keplr.enable(chainInfo.chainId);
          const offlineSigner = window.getOfflineSigner(chainInfo.chainId);
          const accounts = await offlineSigner.getAccounts();
          address = accounts[0].address;
        }
        // else if (networkType === "keplr" && window.keplr) {
        //   await window.keplr.enable(chainId);
        //   const offlineSigner = window.getOfflineSigner(chainId);
        //   const accounts = await offlineSigner.getAccounts();
        //   address = accounts[0].address;
        // }
         else {
          console.warn("No wallet detected for the specified network type.");
          address = "No supported wallet found for this network type.";
        }

        setSelectedAddress(address);
        onSelectAddress(address);
      } catch (error) {
        console.error("Error fetching user address:", error);
        setSelectedAddress("Error fetching address");
      }
    };

    if (config !== null) {
      fetchUserAddress();
    }
  }, [config]);

  return (
    <>
      <div>
        <select
          className="block w-full p-2 mt-1 border bg-slate-200 border-gray-300 rounded-md focus:outline-none"
          value={selectedAddress}
          // disabled={!selectedAddress}
          onChange={(e) => setSelectedAddress(e.target.value)}
        >
          <option value={selectedAddress}>{selectedAddress}</option>
        </select>
      </div>
      <WalletBalance address={selectedAddress} networkType={config?.type?.toLowerCase()} onUpdateBalance={onUpdateBalance}/>
    </>
  );
};

export default DropdownConnectedWallet;
