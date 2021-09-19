import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { Darkmode } from 'src/context/DarkmodeContext';
import LeftMenuItems from './LeftMenuItems';

const DRAWER_WIDTH = 240;

const useStyles = makeStyles((theme) => ({
  hide: {
    display: 'none',
  },
  drawer: {
    width: DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerPaper: {
    backgroundColor: theme.palette.type === Darkmode.DARK ? '#5d1a1a' : '#ffd6d6',
  },
  drawerOpen: {
    width: DRAWER_WIDTH,
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
}));

interface LeftMenuProps  {
  isMenuOpen: boolean;
  handleMenuClose: () => void;
}

const LeftMenu:React.FC<LeftMenuProps> = ({ isMenuOpen, handleMenuClose }) => {
  const classes = useStyles();

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: isMenuOpen,
        [classes.drawerClose]: !isMenuOpen,
      })}
      classes={{
        paper: clsx(classes.drawerPaper, {
          [classes.drawerOpen]: isMenuOpen,
          [classes.drawerClose]: !isMenuOpen,
        }),
      }}
    >
      <div className={classes.toolbar}>
        <IconButton onClick={handleMenuClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List subheader={
        <ListSubheader component="div" classes={{ root: clsx({ [classes.hide]: !isMenuOpen })}}>Log Streams</ListSubheader>
      }>
        <LeftMenuItems />
      </List>
    </Drawer>
  );
};

export default LeftMenu;

