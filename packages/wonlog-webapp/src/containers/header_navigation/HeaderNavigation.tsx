import React, { useState, Fragment } from 'react';

const HeaderNavigation:React.FC = props => {
  const [headerString, setHeaderString] = useState('This is header!');
  return (
    <Fragment>
      <div>{headerString}</div>
    </Fragment>
  );
};

export default HeaderNavigation;
