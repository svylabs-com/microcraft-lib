import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import Web3 from "web3";
import { SigningStargateClient } from "@cosmjs/stargate";
import Wallet from "./components/Web3/DropdownConnectedWallet";
import Graph from "./components/outputPlacement/GraphComponent";
import Table from "./components/outputPlacement/TableComponent";
import TextOutput from "./components/outputPlacement/TextOutput";
import Loading from "./components/loadingPage/Loading";
import Swap from "./components/Web3/Swap/WalletSwap";
import JsonViewer from './components/Renderer/JsonViewer';
import Alert from "./components/Renderer/Alert";
import { ERC20_ABI } from './components/ABI/ERC20_ABI';
import { ERC721_ABI } from './components/ABI/ERC721_ABI';
import { ERC1155_ABI } from './components/ABI/ERC1155_ABI';

interface Props {
  components: any[];
  network?: any;
  contracts?: any;
  data: { [key: string]: any };
  setData: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  debug: React.Dispatch<React.SetStateAction<any>>;
}

const DynamicApp: React.FC<Props> = ({ components, data, setData, debug, network, contracts }) => {
  const [loading, setLoading] = useState(false);
  const [networkDetails, setNetworkDetails] = useState<any>(null);
  const [contractDetails, setContractDetails] = useState<any[]>([]);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [networkName, setNetworkName] = useState('');
  const [chainId, setChainId] = useState('');
  const [networkStatus, setNetworkStatus] = useState<string>('');
  const [cosmosClient, setCosmosClient] = useState<SigningStargateClient | null>(null);

  useEffect(() => {
    // Update network details if available
    if (network) {
      setNetworkDetails(network);
    }

    // Update contract details if available
    if (contracts) {
      setContractDetails(contracts);
    }
  }, [network, contracts]);

  console.log("app.TSX-loadedData: ", networkDetails);
  console.log("typeof app.TSX-loadedData: ", typeof networkDetails);
  console.log("app.TSX-loadedData: ", contractDetails);
  console.log("typeof app.TSX-loadedData: ", typeof contractDetails);

  const supportedNetworks = networkDetails || [];
  const networkType = Array.isArray(supportedNetworks) ? supportedNetworks[0]?.type : supportedNetworks.type;
  const rpcUrls = Array.isArray(supportedNetworks) ? supportedNetworks[0]?.config?.rpcUrl : supportedNetworks.config?.rpcUrl;
  const chainIds = Array.isArray(supportedNetworks) ? supportedNetworks[0]?.config?.chainId : supportedNetworks.config?.chainId;

  const addNetwork = async () => {
    const { ethereum } = window;
    if (ethereum) {
      try {
        const provider = new ethers.BrowserProvider(ethereum);
        await ethereum.send("eth_requestAccounts", []);
        const network = await provider.getNetwork();
        console.log("Network:", network);

        if (network && network.chainId && network.name) {
          setNetworkName(network.name);
          setChainId(network.chainId.toString());

          let isSupported = false;

          if (Array.isArray(supportedNetworks)) {
            for (const supportedNetwork of supportedNetworks) {
              if (supportedNetwork.config.chainId === network.chainId.toString()) {
                isSupported = true;
                break;
              }
            }
          } else if (typeof supportedNetworks === 'object' && supportedNetworks !== null) {
            if (supportedNetworks.config.chainId === network.chainId.toString()) {
              isSupported = true;
            }
          }

          if (isSupported) {
            setNetworkStatus(`Connected to ${network.name}`);
          } else {
            setNetworkStatus(`Connected to unsupported network: ${network.name}. Please connect to a supported network.`);
            setAlertOpen(true);
          }
        } else {
          console.error("Invalid network object:", network);
          setNetworkStatus('Error getting network. Please check your connection and try again.');
          setAlertOpen(true);
        }
      } catch (error) {
        console.error('Error getting network:', error);
        setNetworkStatus('Error getting network. Please check your connection and try again.');
        setAlertOpen(true);
      }
    } else {
      setNetworkStatus('Not connected to any network. Please connect your wallet.');
      setAlertOpen(true);
    }
  };

  const switchToSupportedNetwork = async () => {
    const formatChainId = (chainId: any) => {
      if (typeof chainId === 'number') {
        return `0x${chainId.toString(16)}`;
      } else if (typeof chainId === 'string' && !chainId.startsWith('0x')) {
        return `0x${parseInt(chainId, 10).toString(16)}`;
      }
      return chainId;
    };

    const validateNetworkParams = (network: any) => {
      return network.config.chainId && network.config.rpcUrl && network.config.rpcUrl.length > 0;
    };

    const addAndSwitchNetwork = async (supportedNetwork: any) => {
      if (!validateNetworkParams(supportedNetwork)) {
        console.error('Missing required network parameters:', supportedNetwork);
        setNetworkStatus('Failed to add network. Missing required parameters.');
        setAlertOpen(true);
        return;
      }

      const chainId = formatChainId(supportedNetwork.config.chainId);
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId,
            chainName: supportedNetwork.type,
            rpcUrls: [supportedNetwork.config.rpcUrl],
            blockExplorerUrls: [supportedNetwork.config.exploreUrl],
          }],
        });
        setAlertOpen(false);
        setNetworkStatus(`Connected to ${supportedNetwork.type}`);
      } catch (addError: any) {
        console.error('Error adding network:', addError);
        setNetworkStatus(`Failed to add network: ${addError.message}`);
        setAlertOpen(true);
      }
    };

    const switchNetwork = async (supportedNetwork: any) => {
      if (!supportedNetwork.config.chainId) {
        console.error('Missing required network parameter: chainId', supportedNetwork);
        setNetworkStatus('Failed to switch network. Missing chainId.');
        setAlertOpen(true);
        return;
      }

      const chainId = formatChainId(supportedNetwork.config.chainId);
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        });
        setAlertOpen(false);
        setNetworkStatus(`Connected to ${supportedNetwork.type}`);
      } catch (switchError: any) {
        console.error('Error switching network:', switchError);
        if (switchError.code === 4902) {
          await addAndSwitchNetwork(supportedNetwork);
        } else {
          setNetworkStatus(`Failed to switch network: ${switchError.message}`);
          setAlertOpen(true);
        }
      }
    };

    if (Array.isArray(supportedNetworks) && supportedNetworks.length > 0) {
      await addNetwork();
      await switchNetwork(supportedNetworks[0]);
    } else if (typeof supportedNetworks === 'object' && supportedNetworks !== null) {
      await addNetwork();
      await switchNetwork(supportedNetworks);
    } else {
      console.error('No supported networks available.');
      setNetworkStatus('No supported networks available. Please add a supported network.');
      setAlertOpen(true);
    }
  };

  const initializeCosmosClient = async () => {
    if (rpcUrls) {
      try {
        const chainId = chainIds || "cosmoshub-4";

        if (!window.keplr) {
          throw new Error("Keplr extension is not installed");
        }

        await window.keplr.enable(chainId);
        const offlineSigner = window.getOfflineSigner(chainId);
        const client = await SigningStargateClient.connectWithSigner(rpcUrls, offlineSigner);

        setCosmosClient(client);
      } catch (error) {
        console.error("Error initializing Cosmos client:", error);
      }
    }
  };

  useEffect(() => {
    addNetwork();
    initializeCosmosClient();
  }, [networkDetails]);

  const web3 = new Web3(window.ethereum);

  const injectedContracts = contractDetails?.reduce((contracts: any, contract: any) => {
    if (contract.abi && contract.abi.length > 0) {
      // If ABI is directly provided, use it.
      contracts[contract.name] = {
        ...new web3.eth.Contract(contract.abi, contract.address),
        abi: contract.abi
      };
    } else if (contract.template) {
      const templateMap = {
        'ERC20': ERC20_ABI,
        'ERC721': ERC721_ABI,
        'ERC1155': ERC1155_ABI,
      };

      const contractPath = templateMap[contract.template as keyof typeof templateMap];
      if (contractPath) {
        contracts[contract.name] = {
          ...new web3.eth.Contract(contract.abi, contract.address),
          abi: contractPath
        };
      } else {
        console.error(`No valid template found for contract: ${contract.template}`);
      }
    } else {
      console.error(`No ABI or template found for contract ${contract.name}`);
    }
    return contracts;
  }, {}) || {};

  const mcLib = {
    web3: web3,
    contracts: injectedContracts,
    cosmosClient: cosmosClient,
  };
  console.log(mcLib);

  useEffect(() => {
    console.log(mcLib);
  }, [networkDetails]);

  useEffect(() => {
    console.log(components);
    components.forEach((component) => {
      if (component.events) {
        component.events.forEach((event: any) => {
          if (event.event === "onLoad" && event.eventsCode) {
            executeOnLoadCode(event.eventsCode);
          }
        });
      }
    });
  }, [components]);

  const executeOnLoadCode = async (code: any) => {
    try {
      setLoading(true);
      const config = mcLib.web3.config;
      console.log(config);
      const result = await eval(code);
      if (typeof result === "object") {
        setData((prevData) => ({ ...prevData, ...result }));
        debug((prevOutputCode: any) => ({ ...prevOutputCode, ...result }));
      }
    } catch (error) {
      console.error("Error executing onLoad code:", error);
    } finally {
      setLoading(false);
    }
  };

  const executeOnChangeCode = async (code: any, data: any) => {
    try {
      setLoading(true);
      console.log("Executing onChange code:", code);
      const config = mcLib.web3.config;
      const result = await eval(code);
      
      // Update state with the merged result
      setData(prevData => {
        const updatedData = { ...prevData, ...result };
        // console.log("updated-Data", updatedData);
        debug(updatedData);  // Pass updatedData to debug function
        return updatedData;
      });
  
    } catch (error) {
      console.error("Error executing onChange code:", error);
      debug(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (id: string, value: any, eventCode?: string, eventType?: string) => {
    setData((prevInputValues) => ({
      ...prevInputValues,
      [id]: value,
    }));

    // console.log("handleInputChange Data:", id, value, eventCode, eventType);

    if (eventType === "onChange" && eventCode) {
      executeOnChangeCode(eventCode, { ...data, [id]: value });
    }
  };

  const handleRun = async (code: string, data: { [key: string]: string }) => {
    try {
      setLoading(true);
      const config = mcLib.web3.config;
      console.log(config);
      const result = await eval(code);
      
      // Update state with the merged result
      setData(prevData => {
        // const updatedData = { ...prevData, ...result };
        const updatedData = { ...data, ...prevData, ...result };
        debug(updatedData);
        return updatedData;
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      debug(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // console.log("data", data);

  return (
    <>
      <div className="md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto">
        <ul className="whitespace-normal break-words lg:text-lg">
          {components.map((component, index) => (
            <li key={index} className="mb-4">
              {(component.placement === "input" ||
                component.placement === "output") && (
                  <div>
                    <label className="text-slate-500 font-semibold text-lg xl:text-xl">
                      {component.label}:
                    </label>
                  </div>
                )}

              {/* display the output data where developers/users want */}
              {component.placement === "output" && (
                <div key={component.id}>
                  {(() => {
                    switch (component.type) {
                      case "text":
                        return <TextOutput data={data[component.id]} />;
                      case "json":
                        return (
                          <pre
                            className="overflow-auto w-full mt-2 px-4 py-2 bg-gray-100 overflow-x-auto border border-gray-300 rounded-lg"
                            style={{
                              ...(component.config && typeof component.config.styles === 'object'
                                ? component.config.styles
                                : {}),
                            }}
                          >
                            {data[component.id]
                              ? `${component.id}: ${JSON.stringify(data[component.id], null, 2)}`
                              : ""}
                          </pre>
                        );
                      case "table":
                        return <Table data={data[component.id]} />;
                      case "graph":
                        return (
                          <div>
                            <Graph
                              key={`graph-${component.id}`}
                              output={data[component.id]}
                              configurations={
                                component.config.graphConfig
                              }
                              graphId={`graph-container-${component.id}`}
                            />
                          </div>
                        );
                      default:
                        return null;
                    }
                  })()}
                </div>
              )}

              {component.placement === "input" &&
                (component.type === "text" ||
                  component.type === "number" ||
                  component.type === "file") && (
                  <input
                    className="w-full px-4  p-2 mt-1 border bg-slate-200 border-gray-300 rounded focus:outline-none"
                    style={{
                      ...(component.config && typeof component.config.styles === 'object'
                        ? component.config.styles
                        : {}),
                    }}
                    type={component.type}
                    id={component.id}
                    value={data[component.id] || ""}
                    onChange={(e) => {
                      components.forEach((elements) => {
                        if (elements.events) {
                          elements.events.forEach((event: any) => {
                            if (event.event === "onChange") {
                              const eventCode = event.eventsCode;
                              handleInputChange(component.id, e.target.value, eventCode, "onChange");
                            }
                          });
                        }
                        handleInputChange(component.id, e.target.value);
                      });
                    }}
                  />
                )}
              {component.placement === "input" &&
                (component.type === "json") && (
                  <div
                    style={{
                      ...(component.config && typeof component.config.styles === 'object'
                        ? component.config.styles
                        : {}),
                    }}
                    id={component.id}
                  >
                    <JsonViewer
                      jsonData={data[component.id]}
                      setJsonData={(updatedData) => {
                        components.forEach((elements) => {
                          if (elements.events) {
                            elements.events.forEach((event: any) => {
                              if (event.event === "onChange") {
                                const eventCode = event.eventsCode;
                                handleInputChange(component.id, updatedData, eventCode, "onChange");
                              }
                            });
                          } 
                          handleInputChange(component.id, updatedData);
                        });
                      }}
                    />
                  </div>
                )}
              {component.type === "swap" && (
                <div
                  style={{
                    ...(component.config && typeof component.config.styles === 'object'
                      ? component.config.styles
                      : {}),
                  }}
                >
                   <Swap
                    configurations={component.config.swapConfig}
                    onSwapChange={(swapData: any) => {
                      components.forEach((elements) => {
                        if (elements.events) {
                          elements.events.forEach((event: any) => {
                            if (event.event === "onChange") {
                              const eventCode = event.eventsCode;
                              handleInputChange(component.id, swapData, eventCode, "onChange");
                            }
                          });
                        }
                        handleInputChange(component.id, swapData);
                      });
                    }}
                    data={data}
                  />
                </div>
              )}
              {component.type === "dropdown" && (
                <select
                  className="block w-full p-2 mt-1 border bg-slate-200 border-gray-300 rounded-md focus:outline-none"
                  id={component.id}
                  value={data[component.id]}
                  onChange={(e) => {
                    components.forEach((elements) => {
                      if (elements.events) {
                        elements.events.forEach((event: any) => {
                          if (event.event === "onChange") {
                            const eventCode = event.eventsCode;
                            handleInputChange(component.id, e.target.value, eventCode, "onChange");
                          }
                        });
                      }
                      handleInputChange(component.id, e.target.value);
                    });
                  }}
                  style={{
                    ...(component.config && typeof component.config.styles === 'object'
                      ? component.config.styles
                      : {}),
                  }}
                >
                  {component.config && component.config.optionsConfig && component.config.optionsConfig.values.map((option: any, idx: any) => (
                    <option key={idx} value={option.trim()}>
                      {option.trim()}
                    </option>
                  ))}
                </select>
              )}
              {component.type === "radio" && (
                <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-3">
                  {component.config && component.config.optionsConfig &&
                    component.config
                      .optionsConfig.values.map((option: any, idx: any) => {
                        const optionWidth = option.trim().length * 8 + 48;

                        return (
                          <div
                            key={idx}
                            className={`flex flex-shrink-0 items-center mr-2 md:mr-3 ${optionWidth > 200 ? "overflow-x-auto md:h-8" : ""
                              } h-7 md:w-[12.4rem] lg:w-[15rem] xl:w-[14.1rem] relative`}
                          >
                            <input
                              type="radio"
                              id={`${component.id}_${idx}`}
                              name={component.id}
                              value={option.trim()}
                              checked={data[component.id] === option}
                              onChange={(e) => {
                                components.forEach((elements) => {
                                  if (elements.events) {
                                    elements.events.forEach((event: any) => {
                                      if (event.event === "onChange") {
                                        const eventCode = event.eventsCode;
                                        handleInputChange(component.id, e.target.value, eventCode, "onChange");
                                      }
                                    });
                                  }
                                  handleInputChange(component.id, e.target.value);
                                });
                              }}
                              className="mr-2 absolute"
                              style={{
                                top: "50%",
                                transform: "translateY(-50%)",
                              }}
                            />
                            <label
                              htmlFor={`${component.id}_${idx}`}
                              className="whitespace-nowrap"
                              style={{ marginLeft: "1.5rem" }}
                            >
                              {option.trim()}
                            </label>
                          </div>
                        );
                      })}
                </div>
              )}
              {component.type === "checkbox" && (
                <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-3">
                  {component.config && component.config.optionsConfig &&
                    component.config
                      .optionsConfig.values.map((option: any, idx: any) => {
                        const optionWidth = option.trim().length * 8 + 48;

                        return (
                          <div
                            key={idx}
                            className={`flex flex-shrink-0 items-center mr-2 md:mr-3 ${optionWidth > 200 ? "overflow-x-auto md:h-8" : ""
                              } h-7 md:w-[10.75rem] lg:w-[12.75rem] xl:w-[14.75rem] relative`}
                          >
                            <input
                              type="checkbox"
                              id={`${component.id}_${idx}`}
                              checked={
                                data[component.id] &&
                                data[component.id].includes(option)
                              }
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const currentValue = data[component.id] || [];
                                const updatedValue = isChecked
                                  ? [...currentValue, option]
                                  : currentValue.filter(
                                    (item: any) => item !== option
                                  );
                                components.forEach((elements) => {
                                  if (elements.events) {
                                    elements.events.forEach((event: any) => {
                                      if (event.event === "onChange") {
                                        const eventCode = event.eventsCode;
                                        handleInputChange(component.id, updatedValue, eventCode, "onChange");
                                      }
                                    });
                                  }
                                  handleInputChange(component.id, updatedValue);
                                });
                              }}
                              className="mr-2 absolute"
                              style={{
                                top: "50%",
                                transform: "translateY(-50%)",
                              }}
                            />
                            <label
                              htmlFor={`${component.id}_${idx}`}
                              className="whitespace-nowrap"
                              style={{ marginLeft: "1.5rem" }}
                            >
                              {option.trim()}
                            </label>
                          </div>
                        );
                      })}
                </div>
              )}
              {component.type === "slider" && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      id={component.id}
                      className="w-full h-8 cursor-pointer" //md:w-[60%]
                      name={component.label}
                      min={
                        component.config.sliderConfig
                          .interval.min
                      }
                      max={
                        component.config.sliderConfig
                          .interval.max
                      }
                      step={
                        component.config.sliderConfig
                          .step
                      }
                      value={
                        data[component.id] ||
                        component.config.sliderConfig
                          .value
                      }
                      onChange={(e) => {
                        console.log("components:", components);
                        components.forEach((elements) => {
                          if (elements.events) {
                            elements.events.forEach((event: any) => {
                              if (event.event === "onChange") {
                                const eventCode = event.eventsCode;
                                handleInputChange(component.id, e.target.value, eventCode, "onChange");
                              }
                            });
                          }
                          handleInputChange(component.id, e.target.value);
                        });
                      }}
                    />
                    <span className="font-semibold">
                      {data[component.id] ||
                        component.config.sliderConfig
                          .value}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <svg className="w-6 h-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4 -4" />
                    </svg>
                    <span>Recommended: <strong className="text-blue-600">{component.config.sliderConfig.value}</strong></span>
                  </p>
                </div>
              )}
              {component.type === "walletDropdown" && (
                <div>
                  <Wallet
                    configurations={networkDetails}
                    onSelectAddress={(address) => {
                      components.forEach((elements) => {
                        if (elements.events) {
                          elements.events.forEach((event: any) => {
                            if (event.event === "onChange") {
                              const eventCode = event.eventsCode;
                              handleInputChange(component.id, { address, balance: null }, eventCode, "onChange");
                            }
                          });
                        }
                        handleInputChange(component.id, { address, balance: null });
                      });
                    }}
                    onUpdateBalance={(balance) => {
                      components.forEach((elements) => {
                        if (elements.events) {
                          elements.events.forEach((event: any) => {
                            if (event.event === "onChange") {
                              const eventCode = event.eventsCode;
                              handleInputChange(component.id, { address: data[component.id]?.address || "", balance }, eventCode, "onChange");
                            }
                          });
                        }
                        handleInputChange(component.id, { address: data[component.id]?.address || "", balance });
                      });
                    }}
                  />
                </div>
              )}
              {component.type === "button" && component.code && (
                <button
                  className="block px-4 p-2 mt-2 font-semibold text-white bg-red-500 border border-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring focus:border-red-700"
                  style={{
                    ...(component.config && typeof component.config.styles === 'object'
                      ? component.config.styles
                      : {}),
                  }}
                  id={component.id}
                  onClick={() => handleRun(component.code!, data)}
                >
                  {component.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      {loading && <Loading />}
      {networkStatus !== `Connected to ${networkName}` && (
        <Alert
          isOpen={alertOpen}
          onClose={() => setAlertOpen(false)}
          networkStatus={networkStatus}
          onSwitchNetwork={switchToSupportedNetwork}
        />
      )}
    </>
  );
};

export default DynamicApp;
