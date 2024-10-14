import React from "react";

interface TableProps {
  data: any;
}

const TableComponent: React.FC<TableProps> = ({ data }) => {
  const formatOutput = (data: any) => {
    // if (data === null || data === undefined) {
    //   console.error("Error: Data is null or undefined");
    //   return "No output available for Table.";
    // }

    if (typeof data === "object") {
      if (Array.isArray(data)) {
        if (data.length > 0 && typeof data[0] === "object") {
          const tableHeaders = Object.keys(data[0]);
          return (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                  <tr>
                    {tableHeaders.map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item: any, index: number) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      {tableHeaders.map((header) => (
                        <td
                          key={header}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          {item[header] || ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      } else {
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(data).map(([key, value]: [string, any]) => (
                <tr key={key} className="hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {key}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatOutput(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
    }
    return data;
  };

  return (
    <div className="overflow-auto w-full mt-2 px-4 py-2 bg-gray-100 overflow-x-auto  border border-gray-300 rounded-lg">
      {formatOutput(data) || <pre></pre>}
    </div>
  );
};

export default TableComponent;
