import React from 'react';

const DescriptionComponent = ({ data }) => {
  return (
    <p>
      {/* {data ? JSON.stringify(data, null, 2) : ""} */}
      {data ? data : ""}
    </p>
  );
};

export default DescriptionComponent;
