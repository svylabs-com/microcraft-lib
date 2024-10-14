import React from "react";

interface TextOutputProps {
  data: any;
}

const TextOutput: React.FC<TextOutputProps> = ({ data }) => {
  const convertToText = (data: any): string => {
    if (data === undefined || data === null) {
      return "";
    } else if (
      typeof data === "string" ||
      typeof data === "number" ||
      typeof data === "boolean"
    ) {
      return String(data);
    } else if (Array.isArray(data)) {
      return data.map(convertToText).join(", ");
    } else if (typeof data === "object") {
      if (data instanceof Date) {
        return data.toLocaleString();
      } else if (data instanceof Map || data instanceof Set) {
        return convertToText(Array.from(data));
      } else {
        try {
          return JSON.stringify(data);
        } catch (error) {
          console.error("Error converting object to text:", error);
          return "Error converting object to text";
        }
      }
    } else {
      return "Unsupported data format";
    }
  };

  return (
    <pre className="overflow-auto w-full mt-2 px-4 py-2 bg-gray-100 overflow-x-auto  border border-gray-300 rounded-lg">
      {convertToText(data)}
    </pre>
  );
};

export default TextOutput;
