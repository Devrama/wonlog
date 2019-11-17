import React, { createContext, useState } from 'react';
const { Provider, Consumer } = createContext('something')

const StreamContext:React.FC = props => {
  return (
    <div>
      {props.children}
    </div>
  );
};
