import React from 'react';

interface DescriptionComponentProps {
  data: any;
}

const DescriptionComponent: React.FC<DescriptionComponentProps> = ({ data }) => {
  // console.log("data", data);
  return <p>{data ? data : "Data Not Available"}</p>;
};

export default DescriptionComponent;