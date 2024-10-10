import React, { useEffect } from "react";
import { Modal, Button } from "@mantine/core";
import { Text, Paper } from "@mantine/core";

interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  networkStatus: string;
  onSwitchNetwork: () => void;
}

const Alert: React.FC<AlertProps> = ({ isOpen, onClose, networkStatus, onSwitchNetwork }) => {
  return (
    <Modal opened={isOpen} onClose={onClose} centered title="Network Status">
      <Paper shadow="xs" p="md">
        <Text fw={500}>{networkStatus}</Text>
        <div className="flex gap-3 justify-between">
          <Button className="bg-red-50 text-red-500 hover:text-blue-500 hover:bg-blue-50" mt="md" onClick={onClose} title="Close">cancel</Button>
          <Button className="bg-green-50 text-green-500 hover:text-blue-500 hover:bg-blue-50" mt="md" onClick={onSwitchNetwork} title="Switch to Selected Network">Switch Network</Button>
        </div>
      </Paper>
    </Modal>
  );
};

export default Alert;
