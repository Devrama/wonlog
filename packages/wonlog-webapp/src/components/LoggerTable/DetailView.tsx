import React, { useEffect, useCallback } from 'react';
import ReactJson from 'react-json-view';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { LogData } from 'src/context/LogStreamContext';
import {
  useDarkmode,
  Darkmode,
} from 'src/context/DarkmodeContext';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(() => ({
  detailDrawer: {
    inset: 'unset !important',
  },
  detailDrawerPaper: {
    width: 'calc(100% - 500px)',
    maxWidth: 1000,
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

  const handleKeyPress = useCallback((event) => {
    if(event.key === 'Escape') {
      onClose();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keyup', handleKeyPress);

    return (): void => {
      document.removeEventListener('keyup', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <Drawer
      hideBackdrop={true}
      anchor="right"
      open={isOpen}
      className={classes.detailDrawer}
      classes={{ paper: classes.detailDrawerPaper }}
    >
      <div style={{display: 'flex', borderBottom: '1px solid #000000'}}>
        <div style={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          padding: '0 1em',
        }} >{log?.data.message}</div>
        <div>
          <Tooltip title={<span>Shortcut - Esc</span>}>
            <div>
              <IconButton
                aria-label="Close"
                onClick={(): void => {
                  onClose();
                }}
                title="shortcut - ESC"
              >
                <CloseIcon />
              </IconButton>
            </div>
          </Tooltip>
        </div>
      </div>
      <ReactJson
        src={{
          message: log?.data?.message,
          level: log?.data?.level,
          timestamp: log?.wonlogMetadata.datetime,
            ...log?.data
        }}
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
