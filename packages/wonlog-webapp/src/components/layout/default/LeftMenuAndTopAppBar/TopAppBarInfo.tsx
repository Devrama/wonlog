import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Popover from '@material-ui/core/Popover';
import Badge from '@material-ui/core/Badge';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles((theme) => ({
  infoPopover: {
    width: 300,
    height: 230,
    padding: theme.spacing(2, 2),
    borderRadius: theme.shape.borderRadius,
  },
}));

const TopAppBarInfo:React.FC = () => {
  const classes = useStyles();
  const [openInfo, setOpenInfo] = useState(false);
  const [openInfoAnchorEl, setOpenInfoAnchorEl] = React.useState<HTMLButtonElement>();
  const [updateNotification, setUpdateNotification] = React.useState<string>();

  useEffect(() => {
    axios.get<{ data: { message: string }}>(`${process.env.REACT_APP_UPDATE_NOTIFICATION_HOST}/api/webapp/v${process.env.REACT_APP_WONLOG_VERSION}/update-notification`)
      .then((response) => {
        setUpdateNotification(response.data.data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <IconButton
        aria-label="Info"
        onClick={(e): void => {
          setOpenInfo(true);
          setOpenInfoAnchorEl(e.currentTarget);
        }}
      >
        <Badge badgeContent={updateNotification && 1} color="secondary">
          <InfoIcon />
        </Badge>
      </IconButton>
      <Popover
        open={openInfo}
        classes={{
          paper: classes.infoPopover
        }}
        anchorEl={openInfoAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={(): void => {
          setOpenInfo(false);
        }}
      >
        <Typography variant="h6">Notification</Typography>
        <Box component="form">
          <Typography paragraph>{updateNotification}</Typography>
        </Box>
      </Popover>
    </>
  );
};

export default TopAppBarInfo;
