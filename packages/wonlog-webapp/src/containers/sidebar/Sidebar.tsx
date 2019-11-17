import React, { useState, Fragment } from 'react';

const Sidebar:React.FC = props => {
  const [sidebarString, setSidebarString] = useState('This is sidebar!');
  return (
    <Fragment>
      <div>{sidebarString}</div>
    </Fragment>
  );
};

export default Sidebar;
