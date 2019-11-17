import React, { useState, Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';

const MainBody:React.FC = props => {
  const [bodyString, setBodyString] = useState('hello wonlog!');
  return (
    <Fragment>
      <IconButton aria-label="open or close menu">material ui button</IconButton>
      <div>This is main body area.</div>
      <div>{bodyString}</div>
    </Fragment>
  );
};

export default MainBody;
