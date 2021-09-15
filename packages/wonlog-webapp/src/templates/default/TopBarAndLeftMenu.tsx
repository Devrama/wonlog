import React from 'react';
import clsx from 'clsx';
import { alpha, makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import InputBase from '@material-ui/core/InputBase';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import InfoIcon from '@material-ui/icons/Info';
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import {
  useGlobalConfig,
  GlobalConfigActionType,
  GlobalConfigSetDarkmodePayload,
  GlobalConfigSetSearchModePayload,
} from '../../context/GlobalConfigContext';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  listItemText: {
    '& p': {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
  },
  grow: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const LeftMenu:React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { globalConfig, setGlobalConfig } = useGlobalConfig();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = ():void => {
    setOpen(true);
  };

  const handleDrawerClose = ():void => {
    setOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" display="inline" noWrap>WonLog</Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onFocus={(): void => {
                setGlobalConfig({
                  type: GlobalConfigActionType.SET_SEARCH_KEYWORD,
                  payload: '',
                });
              }}
              onKeyDown={(e): void => {
                if(e.key === 'Enter') {
                  setGlobalConfig({
                    type: GlobalConfigActionType.SET_SEARCH_KEYWORD,
                    payload: e.currentTarget.value,
                  });
                  e.currentTarget.blur();
                }
              }}
              onBlur={(e): void => {
                setGlobalConfig({
                  type: GlobalConfigActionType.SET_SEARCH_KEYWORD,
                  payload: e.target.value,
                });
              }}
            />
          </div>
          <FormControlLabel
            control={<Switch color="default" checked={globalConfig.searchMode === GlobalConfigSetSearchModePayload.REGEX} onChange={(e): void => {
              setGlobalConfig({
                type: GlobalConfigActionType.SET_SEARCH_MODE,
                payload: e.target.checked ? GlobalConfigSetSearchModePayload.REGEX : GlobalConfigSetSearchModePayload.TEXT,
              });
            }} name="regex" />}
            label="Regex"
          />
          <div className={classes.grow} />
         <ToggleButtonGroup
            value={globalConfig.darkmode}
            exclusive
            onChange={(event, mode): void => {
              setGlobalConfig({
                type: GlobalConfigActionType.SET_DARKMODE,
                payload: mode,
              });
            }}
            aria-label="text alignment"
          >
            <ToggleButton value={GlobalConfigSetDarkmodePayload.DARK} aria-label={GlobalConfigSetDarkmodePayload.DARK}>
              <Brightness2Icon />
            </ToggleButton>
            <ToggleButton value={GlobalConfigSetDarkmodePayload.LIGHT} aria-label={GlobalConfigSetDarkmodePayload.LIGHT}>
              <Brightness5Icon />
            </ToggleButton>
          </ToggleButtonGroup>
          <div>
            <IconButton aria-label="Info">
              <InfoIcon />
            </IconButton>
            <IconButton aria-label="Settings">
              <SettingsIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {Array.from(globalConfig.streamIDs).map(streamID => {
            return (
              <ListItem key={streamID} button selected={globalConfig.currentStreamID === streamID} onClick={(): void => { setGlobalConfig({ type: GlobalConfigActionType.SET_CURRENT_STREAM_ID, payload: streamID }); }}>
                <ListItemIcon style={{ minWidth: 33 }}><LibraryBooksIcon /></ListItemIcon>
                <ListItemText className={classes.listItemText} secondary={streamID}  />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </>
  );
};

export default LeftMenu;
