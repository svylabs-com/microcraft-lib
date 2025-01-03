import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FiCopy } from "react-icons/fi";
import Switch from "react-switch";

interface InputComponentProps {
    component: any;
    data: any;
    config: any;
    handleInputChange: (id: string, value: any, eventCode?: string, eventType?: string) => void;
    components: any;
}

const InputComponent: React.FC<InputComponentProps> = ({ component, data, config, handleInputChange, components }) => {
    const [isQrCodeVisible, setIsQrCodeVisible] = useState(false);

    const handleToggleQrCode = (checked: boolean) => {
        setIsQrCodeVisible(checked);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(data[component.id] || "").then(() => {
            alert("Copied to clipboard!");
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
                {config.enableCopyIcon && (
                    <FiCopy
                        onClick={handleCopy}
                        className="absolute right-1 cursor-pointer"
                        aria-label="Copy to clipboard"
                        size={20}
                        color="gray"
                        style={{top: "50%", transform: "translateY(-50%)"}}
                    />
                )}
            </div>

            {/* Display QR Code section if enabled with toggle */}
            {config.enableQrCode && (
                <div className="mt-2 flex items-center space-x-2 justify-end">
                    <label className="text-sm">{isQrCodeVisible ? "Hide QR Code" : "Show QR Code"}</label>
                    <Switch
                        checked={isQrCodeVisible}
                        onChange={handleToggleQrCode}
                        offHandleColor="#d1d5db"
                        onHandleColor="#4caf50"
                        offColor="#e0e0e0"
                        onColor="#81c784"
                        height={20}
                        width={40}
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
