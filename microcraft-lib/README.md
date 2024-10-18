# Microcraft Lib

The package allows a frontend to embed a dynamic web3 UI into their application. The library comes bundled with the following

- A way to define the UI elements and actions dyamically with json / javascript.
- Connections to browser wallets
     - Metamask for Ethereum
     - Keplr wallet for Cosmos
- Connections to networks
    - Ethereum
    - Cosmos(WIP)
 
# Usage

## Installation

```
   npm install microcraft-lib
```

or, if this doesn't work

```
   npm install microcraft-lib --legacy-peer-deps
```

## Usage

```
  // Initializing the app json
  const app = {
     components = [
     ],
     contracts = [
      {
        "address": "0x..",
        "abi": {}
      }
    ],
    network: {
        "type": "ethereum",
        "rpc": "",
        "chainId": 
    }
  }

  // Any initial data for the components of the app. key in this map should be the id of the component
  data = {};
  // A callback function to listen to new data updates.
  function setDataCallback(newData) {
      data = {...data, ...newData}
  }
  

  // You can render this react component.
  <DynamicApp
     components={app.components},
     data={data},
     setData={setDataCallback},
     contracts={app.contracts},
     network={app.network}
    />
     

```
