import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FiCopy } from "react-icons/fi";
// import Toggle from "react-toggle";
import { default as Toggle } from "react-toggle";
import "react-toggle/style.css";

interface InputComponentProps {
    component: any;
    data: any;
    config?: any;
    handleInputChange: (id: string, value: any, eventCode?: string, eventType?: string) => void;
    components: any;
}

const InputComponent: React.FC<InputComponentProps> = ({ component, data, config, handleInputChange, components }) => {
    const [isQrCodeVisible, setIsQrCodeVisible] = useState(false);
    const [showCopyMessage, setShowCopyMessage] = useState(false);

    const handleToggleQrCode = (checked: boolean) => {
        setIsQrCodeVisible(checked);
    };

    // const handleToggleQrCode = () => {
    //     setIsQrCodeVisible(!isQrCodeVisible);
    // };

    const handleCopy = () => {
        navigator.clipboard.writeText(data[component.id] || "").then(() => {
            setShowCopyMessage(true);
            setTimeout(() => setShowCopyMessage(false), 2000); // Hide after 2 seconds
        });
    };

    return (
        <>
            <div className="relative w-full">
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
                        components.forEach((elements: any) => {
                            if (elements.events) {
                                elements.events.forEach((event: any) => {
                                    if (event.type === "onChange") {
                                        const eventCode = event.code;
                                        handleInputChange(component.id, e.target.value, eventCode, "onChange");
                                    }
                                });
                            }
                            handleInputChange(component.id, e.target.value);
                        });
                    }}
                />

                {/* Display copy icon if enabled */}
                {config?.enableCopyIcon && (
                    <div className="absolute right-1 top-1 transform -translate-y-1/2 flex flex-col items-center"
                        style={{ top: "50%", transform: "translateY(-50%)" }}>
                        <FiCopy
                            onClick={handleCopy}
                            title="Copy and Paste Anywhere"
                            className="cursor-pointer"
                            aria-label="Copy to clipboard"
                            size={20}
                            color="gray"
                        />
                        {showCopyMessage && (
                            <span className="absolute top-full mt-5 text-xs text-blue-700 whitespace-nowrap">
                                Copied to clipboard!
                            </span>
                        )}
                    </div>

                )}
            </div>

            {/* Display QR Code section if enabled with toggle */}
            {config?.enableQrCode && (
                <div className="mt-2 flex items-center space-x-2 justify-end">
                    <label className="text-sm">{isQrCodeVisible ? "Hide QR Code" : "Show QR Code"}</label>
                    {/* <Toggle
                        checked={isQrCodeVisible}
                        onChange={handleToggleQrCode}
                        icons={false}
                    /> */}
                    <Toggle
    checked={isQrCodeVisible}
    onChange={(e) => handleToggleQrCode(e.target.checked)}
/>

                </div>
            )}

            {/* Display the QR Code if toggled on */}
            {isQrCodeVisible && (
                <div className="flex mt-4 justify-center">
                    <QRCodeSVG value={data[component.id] || "No data available"} size={128} />
                </div>
            )}
        </>
    );
};

export default InputComponent;
