import React from 'react';

interface DescriptionComponentProps {
  data: any;
}

const DescriptionComponent: React.FC<DescriptionComponentProps> = ({ data }) => {
  return <p>{data ? data : ""}</p>;
};

export default DescriptionComponent;
