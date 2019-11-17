import React, { useState, useContext, Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { LogStreamContext } from '../../context/LogStreamContext'

const MainBody:React.FC = props => {
  const [bodyString, setBodyString] = useState('hello wonlog!');
  const logs = useContext(LogStreamContext);
  return (
    <Fragment>
      <IconButton aria-label="open or close menu">material ui button</IconButton>
      <div>This is main body area.</div>
      <div>{bodyString}</div>
      <div>{JSON.stringify(logs)}</div>
    </Fragment>
  );
};

export default MainBody;
