import React from "react";

interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  networkStatus: string;
  onSwitchNetwork: () => void;
}

const Alert: React.FC<AlertProps> = ({ isOpen, onClose, networkStatus, onSwitchNetwork }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm sm:max-w-md md:max-w-lg w-full mx-4 sm:mx-6">
        <h2 className="text-xl font-bold mb-4 text-center">Network Status</h2>
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <p className="font-medium text-center">{networkStatus}</p>
        </div>
        <div className="flex gap-3 justify-between">
          <button
            className="bg-red-50 text-red-500 hover:text-blue-500 hover:bg-blue-50 px-4 py-2 rounded w-full sm:w-auto"
            onClick={onClose}
            title="Close"
          >
            Cancel
          </button>
          <button
            className="bg-green-50 text-green-500 hover:text-blue-500 hover:bg-blue-50 px-4 py-2 rounded w-full sm:w-auto"
            onClick={onSwitchNetwork}
            title="Switch to Selected Network"
          >
            Switch Network
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
