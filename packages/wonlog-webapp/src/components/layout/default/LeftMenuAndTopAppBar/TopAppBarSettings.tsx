import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import SettingsIcon from '@material-ui/icons/Settings';
import SortIcon from '@material-ui/icons/Sort';
import {
  useGlobalConfig,
  GlobalConfigActionType,
  GlobalConfigSetLogSortingPayload,
} from 'src/context/GlobalConfigContext';

const useStyles = makeStyles((theme) => ({
  settingPopover: {
    width: 300,
    height: 230,
    padding: theme.spacing(2, 2),
    borderRadius: theme.shape.borderRadius,
  },
}));

const TopAppBarSettings:React.FC = () => {
  const classes = useStyles();
  const { globalConfig, setGlobalConfig } = useGlobalConfig();
  const [openSetting, setOpenSetting] = useState(false);
  const [openSettingAnchorEl, setOpenSettingAnchorEl] = useState<HTMLButtonElement>();

  return (
    <>
      <IconButton
        aria-label="Settings"
        onClick={(e): void => {
          setOpenSetting(true);
          setOpenSettingAnchorEl(e.currentTarget);
        }}
      >
        <SettingsIcon />
      </IconButton>
      <Popover
        open={openSetting}
        classes={{
          paper: classes.settingPopover
        }}
        anchorEl={openSettingAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={(): void => {
          setOpenSetting(false);
        }}
      >
        <Typography variant="h6">Settings</Typography>
        <Box>
          <FormControl margin="dense">
            <FormHelperText>Maximum Buffer Size</FormHelperText>
            <TextField
              defaultValue={globalConfig.logBufferSize}
              variant="outlined"
              size="small"
              type="number"
              onBlur={(e): void => {
                setGlobalConfig({
                  type: GlobalConfigActionType.SET_LOG_BUFFER_SIZE,
                  payload: Number.parseInt(e.target.value, 10),
                });
              }}
            />
          </FormControl>
          <FormControl margin="dense">
            <FormHelperText>Sorting</FormHelperText>
            <ToggleButtonGroup
                value={globalConfig.logSorting}
                exclusive
                onChange={(event, orderBy): void => {
                  if(orderBy) {
                    setGlobalConfig({
                      type: GlobalConfigActionType.SET_LOG_SORTING,
                      payload: orderBy,
                    });
                  }
                }}
                aria-label="text alignment"
            >
              <ToggleButton value={GlobalConfigSetLogSortingPayload.DESC} aria-label={GlobalConfigSetLogSortingPayload.DESC}>
                <SortIcon />
              </ToggleButton>
              <ToggleButton value={GlobalConfigSetLogSortingPayload.ASC} aria-label={GlobalConfigSetLogSortingPayload.ASC}>
                <SortIcon style={{ transform: 'rotate( 180deg)' }} />
              </ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
        </Box>
      </Popover>
    </>
  );
};

export default TopAppBarSettings;
