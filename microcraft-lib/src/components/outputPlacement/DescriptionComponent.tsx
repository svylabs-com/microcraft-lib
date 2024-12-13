import React from 'react';

interface DescriptionComponentProps {
  data: any;
  template: any;
}

const DescriptionComponent: React.FC<DescriptionComponentProps> = ({ data, template }) => {
  // console.log("data", data);
  let toDisplay = data? data.toString() : "Data Not Available";
  if (template && data && typeof data === "object") {
    toDisplay = template.replace(/\${(.*?)}/g, (x: any, g: any) => data[g]);
  } else if (template) {
    toDisplay = template;
  }
  return <p>{toDisplay}</p>;
};

export default DescriptionComponent;