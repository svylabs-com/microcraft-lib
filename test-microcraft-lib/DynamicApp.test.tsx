import React from 'react';
import ReactDOM from 'react-dom';
import DynamicApp from '../microcraft-lib/src/DynamicApp';

// Consolidated mock data
const mockProps = {
  networkDetails: [
    {
      type: 'Ethereum',
      config: {
        chainId: '0x1',
        rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
        exploreUrl: 'https://etherscan.io',
      },
    },
  ],
  contractDetails: [
    {
      name: 'MyERC20Contract',
      address: '0x1234567890abcdef',
      abi: [
        {
          inputs: [],
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        {
          name: 'totalSupply',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      template: 'ERC20',
    },
  ],
  components: [
    {
      id: 'erc20AddressInput',
      type: 'text',
      label: 'Enter ERC20 Address',
      placement: 'input',
    },
    {
      id: 'fetchERC20Data',
      type: 'button',
      label: 'Fetch ERC20 Data',
      code: 'async function fetchERC20Data() { console.log("Fetching data..."); }',
      placement: 'action',
    },
    {
      id: 'erc20TotalSupply',
      type: 'text',
      label: 'Total ERC20 Supply',
      placement: 'output',
    },
    {
      id: 'erc20Name',
      type: 'text',
      label: 'ERC20 Token Name',
      placement: 'output',
    },
    {
      id: 'erc20UserBalance',
      type: 'text',
      label: 'User\'s ERC20 Balance',
      placement: 'output',
    },
  ],
  data: {
    walletAddressSelect: {
      address: '0xd4ac2651cea6890c1fd2b65b329ed28c4b569519',
      balance: 0
    }
  },
  setData: (data: any) => {
    console.log('setData called with:', data);
  },
  debug: (code: any) => {
    console.log('Output code:', code);
  },
};

// Test function to render and test the DynamicApp
function testDynamicApp() {
  // Create a container to render the component
  const container = document.createElement('div');
  document.body.appendChild(container);

  // Render the DynamicApp with consolidated props
  ReactDOM.render(
    <DynamicApp
      components={mockProps.components}
      data={mockProps.data}
      setData={mockProps.setData}
      contracts={mockProps.contractDetails}
      network={mockProps.networkDetails}
      debug={mockProps.debug}
    />,
    container
  );

  // Perform checks (like querying inputs, buttons, etc.)
  const inputLabelElement = container.querySelector('label[for="erc20AddressInput"]');
  if (inputLabelElement) {
    console.log('Input field is rendered with label:', inputLabelElement.textContent);
    const inputElement = inputLabelElement.nextElementSibling as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '0x123';
      const inputEvent = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(inputEvent); // Simulate typing
    }
  }

  const buttonElement = container.querySelector('button');
  if (buttonElement) {
    console.log('Button is rendered:', buttonElement.textContent);
    buttonElement.click(); // Simulate button click
  }

  // Cleanup after test
  ReactDOM.unmountComponentAtNode(container);
  document.body.removeChild(container);
}

// Call the test function to render and test the component
testDynamicApp();
