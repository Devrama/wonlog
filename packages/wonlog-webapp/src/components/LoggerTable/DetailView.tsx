import React from 'react';
import ReactJson from 'react-json-view';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { LogData } from 'src/context/LogStreamContext';
import {
  useDarkmode,
  Darkmode,
} from 'src/context/DarkmodeContext';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(() => ({
  detailDrawer: {
    inset: 'unset !important',
  },
  detailDrawerPaper: {
    width: 'calc(100% - 500px)',
    overflow: 'none',
  },
}));

interface DetailViewProps {
  isOpen: boolean;
  log?: LogData;
  onClose: () => void;
}

const DetailView: React.FC<DetailViewProps> = ({ isOpen, log, onClose }) => {
  const classes = useStyles();
  const { darkmode } = useDarkmode();

  return (
    <Drawer
      hideBackdrop={true}
      anchor="right"
      open={isOpen}
      className={classes.detailDrawer}
      classes={{ paper: classes.detailDrawerPaper }}
    >
      <div style={{display: 'flex'}}>
        <div style={{flexGrow: 1}} />
        <div>
          <IconButton
            aria-label="Close"
            onClick={(): void => {
              onClose();
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </div>
      <ReactJson
        // eslint-disable-next-line @typescript-eslint/ban-types
        src={{ timestamp: log?.wonlogMetadata.datetime, ...log?.data } as object}
        name={false}
        theme={darkmode === Darkmode.DARK ? 'monokai' : 'rjv-default'}
        displayDataTypes={false}
        displayObjectSize={false}
        enableClipboard={false}
        style={{ flexGrow: 1, padding: 20 }}
        quotesOnKeys={false}
      />
    </Drawer>
  );
};

export default DetailView;
