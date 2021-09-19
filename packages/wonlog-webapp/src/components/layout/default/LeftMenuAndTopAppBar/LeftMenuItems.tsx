import React, { useMemo, ReactElement } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import {
  useGlobalConfig,
  GlobalConfigActionType,
} from 'src/context/GlobalConfigContext';

const useStyles = makeStyles(() => ({
  listItemText: {
    '& p': {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
  },
}));

const LeftMenuItems:React.FC = () => {
  const classes = useStyles();
  const { globalConfig, setGlobalConfig } = useGlobalConfig();

  const component = useMemo<ReactElement>(
    () => {
      return (
        <>
          {Array.from(globalConfig.streamIDs).map(streamID => {
            return (
              <ListItem key={streamID} button selected={globalConfig.currentStreamID === streamID} onClick={(): void => { setGlobalConfig({ type: GlobalConfigActionType.SET_CURRENT_STREAM_ID, payload: streamID }); }}>
                <ListItemIcon style={{ minWidth: 33 }}><LibraryBooksIcon /></ListItemIcon>
                <ListItemText className={classes.listItemText} secondary={streamID}  />
              </ListItem>
            );
          })}
        </>
      );
    },
    [classes, globalConfig.currentStreamID, globalConfig.streamIDs]
  );

  return component;
};

export default LeftMenuItems;
