import React from "react";

const Node = ({ className, onMouseDown, ...props }) => (
  <div {...props} className={className} onMouseDown={onMouseDown} />
);

export default Node;
