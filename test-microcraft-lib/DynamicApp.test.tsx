import React from 'react';
import ReactDOM from 'react-dom';
import DynamicApp from '../microcraft-lib/src/DynamicApp';

// Hardcoded mock data
const mockContractMetaData = {
  networkDetails: [
    {
      type: 'Ethereum',
      config: {
        chainId: '0x1',
        rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
      },
    },
  ],
  contractDetails: [
    {
      name: 'MyContract',
      address: '0x1234567890',
      abi: [
        {
          inputs: [],
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
      ],
    },
  ],
};

const mockComponents = [
  {
    id: 'input-1',
    type: 'text',
    label: 'Input 1',
    placement: 'input',
  },
  {
    id: 'button-1',
    type: 'button',
    label: 'Button 1',
    code: 'console.log("Button 1 clicked!");',
  },
];

const mockData = {
  'input-1': '',
  output: {},
  configurations: {},
};

// Hardcoded functions for testing
const mockSetData = (data: any) => {
  console.log('setData called with:', data);
};

const mockSetOutputCode = (code: string) => {
  console.log('setOutputCode called with:', code);
};

// Function to render the component and manually interact with it
function testDynamicApp() {
  // Create a container div to render the component into
  const container = document.createElement('div');
  document.body.appendChild(container);

  // Render the DynamicApp component
  ReactDOM.render(
    <DynamicApp
      components={mockComponents}
      data={mockData}
      setData={mockSetData}
      setOutputCode={mockSetOutputCode}
      contractMetaData={mockContractMetaData}
    />,
    container
  );

  // Check if the input and button are rendered correctly
  const inputLabelElement = container.querySelector('label[for="input-1"]');
  if (inputLabelElement) {
    console.log('Input 1 is rendered:', inputLabelElement.textContent);

    // Get the input field associated with the label
    const inputElement = inputLabelElement.nextElementSibling as HTMLInputElement | null; // Type assertion
    if (inputElement) {
      console.log('Input field is rendered');
      inputElement.value = 'Hello World'; // Simulate user input
      const inputEvent = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(inputEvent); // Trigger input event manually
    } else {
      console.error('Input element not found.');
    }
  } else {
    console.error('Input label not found.');
  }

  const buttonElement = container.querySelector('button');
  if (buttonElement) {
    console.log('Button 1 is rendered:', buttonElement.textContent);
    buttonElement.click(); // Simulate button click
  } else {
    console.error('Button element not found.');
  }

  // Check if contract details are rendered correctly
  const contractNameElement = container.querySelector('div');
  const contractAddressElement = contractNameElement?.nextElementSibling;

  if (contractNameElement && contractNameElement.textContent === mockContractMetaData.contractDetails[0].name) {
    console.log('Contract name is rendered correctly:', contractNameElement.textContent);
  } else {
    console.error('Contract name not found or incorrect.');
  }

  if (contractAddressElement && contractAddressElement.textContent === mockContractMetaData.contractDetails[0].address) {
    console.log('Contract address is rendered correctly:', contractAddressElement.textContent);
  } else {
    console.error('Contract address not found or incorrect.');
  }

  // Cleanup
  ReactDOM.unmountComponentAtNode(container);
  document.body.removeChild(container);
}

// Call the test function
testDynamicApp();
