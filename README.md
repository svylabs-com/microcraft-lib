# Microcraft Lib

The **Microcraft Lib** package allows you to embed a dynamic Web3 UI into your frontend application. It supports flexible UI definition using JSON/JavaScript and integrates with popular browser wallets.

## Features
- **Dynamic UI**: Define UI elements and actions dynamically using JSON or JavaScript.
- **Wallet Integration**: 
  - Metamask for Ethereum
  - Keplr Wallet for Cosmos (WIP)
- **Networks Integration**: 
  - Ethereum 
  - Cosmos (WIP)

---

## Installation

You can install the package using npm:

```bash
npm install microcraft-lib
```

If there are any peer dependency issues, try installing with:

```bash
npm install microcraft-lib --legacy-peer-deps
```

---

## Usage

Here is an example of how you can set up and use **Microcraft Lib**:

```javascript
// Initializing the app JSON
const app = {
  components: [
    {
      "type": "text",
      "label": "Enter ERC20 Address",
      "id": "erc20AddressInput",
      "placement": "input"
    },
    {
      "type": "button",
      "label": "Fetch ERC20 Data",
      "id": "fetchERC20Data",
      "placement": "action",
      "codeRef": "actions/fetch_token_details.js" // you can define a function that can fetch token details here
    },
    {
      "type": "text",
      "label": "Total ERC20 Supply",
      "id": "erc20TotalSupply",
      "placement": "output"
    },
    {
      "type": "text",
      "label": "ERC20 Token Name",
      "id": "erc20Name",
      "placement": "output"
    },
    {
      "type": "text",
      "label": "ERC20 Token Symbol",
      "id": "erc20Symbol",
      "placement": "output"
    },
    {
      "type": "walletDropdown",
      "label": "Select Connected Wallet Address",
      "id": "walletAddress",
      "options": [],
      "placement": "input"
    },
    {
      "type": "text",
      "label": "Or Enter Wallet Address",
      "id": "walletAddressInput",
      "placement": "input"
    },
    {
      "type": "button",
      "label": "Fetch Wallet Data",
      "id": "fetchWalletInfo",
      "placement": "action",
      "codeRef": "actions/fetch_wallet.js"
    },
    {
      "type": "text",
      "label": "User's ERC20 Balance",
      "id": "erc20UserBalance",
      "placement": "output"
    }
  ],
  contracts: [
    {
      "name": "ERC20",
      "address": "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
      "template": "ERC20",
      "abi": []
    }
  ],
  networks: [
    {
      "type": "ethereum",
      "config": {
        "rpcUrl": "your_rpc_url",
        "chainId": "your_chain_id",
        "exploreUrl": "your_explore_url"
      }
    },
    {
      "type": "cosmos",
      "config": {
        "rpcUrl": "your_cosmos_rpc_url",
        "chainId": "your_cosmos_chain_id",
        "exploreUrl": "your_cosmos_explore_url"
      }
    }
  ]
}

// Initial data for app elements(components)
let data = {};

// Callback function to handle data updates
function setDataCallback(newData) {
  data = { ...data, ...newData };
}

// Debugging
const [outputCode, setOutputCode] = useState<Output | string>();

// Rendering the DynamicApp component
<DynamicApp
  components={app.components}
  data={data}
  setData={setDataCallback}
  contracts={app.contracts}
  networks={app.networks}
  debug={setOutputCode}
/>
```

### Example Explained
- **Components**: Defined as an array, each component has a `type` (e.g., "text", "button", "walletDropdown"), a label, an ID, and a placement that specifies its role (e.g., input, action, output).
- **Contract Details**: Includes details like the contract name, address, template, and ABI for smart contract interaction.
- **Network Details**: Configures the network type and RPC, chain ID, and explorer URL for connection.

You can render the UI dynamically using the `<DynamicApp />` component, which takes in the `components`, `data`, `contracts`, and `networks` details. The app also supports a `debug` function to monitor output data.

--- 

**Enjoy building UI for your favorite web3 dapps with Microcraft Lib!**
