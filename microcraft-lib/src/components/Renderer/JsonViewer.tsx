import React from 'react';
import ReactJson, { InteractionProps } from 'react-json-view';

interface JsonViewerProps {
  jsonData: any;
  setJsonData: React.Dispatch<React.SetStateAction<any>>;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ jsonData, setJsonData }) => {
  const handleEdit = (edit: InteractionProps) => {
    const { updated_src } = edit;
    console.log('Editing JSON:', updated_src);
    setJsonData(updated_src);
  };

  const handleAdd = (add: InteractionProps) => {
    const { updated_src } = add;
    console.log('Adding to JSON:', updated_src);
    setJsonData(updated_src);
  };

  const handleDelete = (del: InteractionProps) => {
    const { updated_src } = del;
    console.log('Deleting from JSON:', updated_src);
    setJsonData(updated_src);
  };

  console.log('JsonViewer jsonData:', jsonData);
  console.log(typeof jsonData);

  return (
    <div className="w-full px-4  p-2 mt-1 border bg-slate-200 border-gray-300 rounded focus:outline-none">
      <ReactJson
        src={jsonData}
        onEdit={handleEdit}
        onAdd={handleAdd}
        onDelete={handleDelete}
        // theme="monokai"
      />
    </div>
  );
};

export default JsonViewer;
