import React, { useState, useEffect, useRef } from "react";

const getDataFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

interface ContractDetail {
    name: string;
    address: string;
}

interface NetworkConfig {
    rpcUrl: string;
    chainId: string;
    exploreUrl: string;
}

interface NetworkDetails {
    type: string;
    config: NetworkConfig;
}

interface FormData {
    selectedContracts: string[];
    contractDetails: ContractDetail[];
    networkDetails: NetworkDetails;
    teamId: string;
    privacy: string;
}

interface ContractDetailsProps {
    onClose: () => void;
}

const ContractDetails: React.FC<ContractDetailsProps> = ({ onClose }) => {
    const [formData, setFormData] = useState<FormData>({
        selectedContracts: [],
        contractDetails: [],
        networkDetails: { type: "", config: { rpcUrl: "", chainId: "", exploreUrl: "" } },
        teamId: "",
        privacy: ""
    });
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedFormData = getDataFromLocalStorage("formData");
        if (savedFormData) {
            setFormData(savedFormData);
        }

        const handleOutsideClick = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white rounded-md p-4 md:p-8 w-full max-w-md relative py-10">
                <span
                    className="absolute font-bold top-0 right-0 cursor-pointer bg-slate-300 text-2xl rounded-full pb-1 px-2.5 m-1 transition duration-300 hover:bg-gray-500 hover:text-white hover:scale-110"
                    onClick={onClose}
                >
                    &times;
                </span>

                <div className="p-3 px-4 bg-gray-200 rounded shadow-lg mt-2">
                    <h2 className="text-lg md:text-xl font-bold text-center text-[#4a4b4c] underline underline-offset-2 mb-2">Contracts Details</h2>

                    {formData.privacy && (
                        <div className="mb-4">
                            <h3 className="text-[#727679] font-semibold text-lg">Privacy:</h3>
                            <p className="text-gray-700">{formData.privacy}</p>
                        </div>
                    )}

                    {formData.teamId && (
                        <div className="mb-4">
                            <h3 className="text-[#727679] font-semibold text-lg">Team ID:</h3>
                            <p className="text-gray-700">{formData.teamId}</p>
                        </div>
                    )}

                    <h3 className="text-[#727679] font-semibold text-lg">Selected Contracts:</h3>
                    {formData.selectedContracts.length > 0 ? (
                        <ul className="list-disc list-inside mb-4">
                            {formData.selectedContracts.map((contract, index) => (
                                <li key={index} className="text-gray-700">{contract}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700">You have not selected any contracts.</p>
                    )}

                    {formData.contractDetails.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-[#727679] font-semibold text-lg">Contract Details:</h3>
                            <ul className="list-disc list-inside">
                                {formData.contractDetails.map((detail, index) => (
                                    <li key={index} className="text-gray-700 overflow-scroll">
                                        Name: {detail.name}, Address: {detail.address}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {formData.networkDetails.type && (
                        <div className="mb-4">
                            <h3 className="text-[#727679] font-semibold text-lg">Network Details:</h3>
                            <p className="text-gray-700">
                                Type: {formData.networkDetails.type}
                            </p>
                            <p className="text-gray-700">
                                RPC URL: {formData.networkDetails.config.rpcUrl}
                            </p>
                            <p className="text-gray-700">
                                Chain ID: {formData.networkDetails.config.chainId}
                            </p>
                            <p className="text-gray-700">
                                Explorer URL: {formData.networkDetails.config.exploreUrl}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
};

export default ContractDetails;
