import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TopAppBarLogoAndOpenMenu from './TopAppBarLogoAndOpenMenu';
import TopAppBarSearch from './TopAppBarSearch';
import TopAppBarDarkmode from './TopAppBarDarkmode';
import TopAppBarInfo from './TopAppBarInfo';
import TopAppBarSettings from './TopAppBarSettings';

const DRAWER_WIDTH = 240;

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#a74747',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  grow: {
    flexGrow: 1,
  },
}));

interface TopAppBarProps  {
  isMenuOpen: boolean;
  handleMenuOpen: () => void;
}

const TopAppBar:React.FC<TopAppBarProps> = ({ isMenuOpen, handleMenuOpen }) => {
  const classes = useStyles();

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: isMenuOpen,
      })}
    >
      <Toolbar>
        <TopAppBarLogoAndOpenMenu
          isMenuOpen={isMenuOpen}
          handleMenuOpen={handleMenuOpen}
        />
        <TopAppBarSearch />
        <div className={classes.grow} />
        <TopAppBarDarkmode />
        <div>
          <TopAppBarInfo />
          <TopAppBarSettings />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;
