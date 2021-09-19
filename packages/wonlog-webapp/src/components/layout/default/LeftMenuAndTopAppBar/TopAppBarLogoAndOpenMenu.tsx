import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(() => ({
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
}));

interface TopAppBarLogoAndOpenMenuProps  {
  isMenuOpen: boolean;
  handleMenuOpen: () => void;
}

const TopAppBarLogoAndOpenMenu:React.FC<TopAppBarLogoAndOpenMenuProps> = ({ isMenuOpen, handleMenuOpen }) => {
  const classes = useStyles();

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleMenuOpen}
        edge="start"
        className={clsx(classes.menuButton, {
          [classes.hide]: isMenuOpen,
        })}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" display="inline" noWrap>WonLog</Typography>
    </>
  );
};

export default TopAppBarLogoAndOpenMenu;
