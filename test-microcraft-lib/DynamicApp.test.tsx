// test-microcraft-lib/DynamicApp.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import DynamicApp from '../microcraft-lib/src/components/DynamicApp';

// Mock data for the required props
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
    // Replace with the actual data structure required by DynamicApp
};

const mockSetData = jest.fn(); // Mock function for setData
const mockSetOutputCodes = jest.fn(); // Mock function for setOutputCodets

describe('DynamicApp', () => {
    test('renders the Dynamic App component', () => {
        render(
            <DynamicApp
                components={mockComponents}
                data={mockData}
                setData={mockSetData}
                setOutputCode={mockSetOutputCodes}
                contractMetaData={mockContractMetaData}
            />
        ); // Render the component with props

        // Check if Input 1 is rendered
        const inputLabelElement = screen.getByLabelText(/Input 1/i);
        expect(inputLabelElement).toBeInTheDocument();

        // Check if Button 1 is rendered
        const buttonElement = screen.getByRole('button', { name: /Button 1/i });
        expect(buttonElement).toBeInTheDocument();

        // Check if contract name and address are rendered
        const contractNameElement = screen.getByText(mockContractMetaData.contractDetails[0].name);
        expect(contractNameElement).toBeInTheDocument();

        const contractAddressElement = screen.getByText(mockContractMetaData.contractDetails[0].address);
        expect(contractAddressElement).toBeInTheDocument();

        // You can also check if the mock functions are called when certain actions happen
        buttonElement.click();
        expect(mockSetData).toHaveBeenCalledTimes(1); // Adjust this assertion based on actual button functionality

        // Add more assertions to test different aspects of the component
    });
});
