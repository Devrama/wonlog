import React, { useState } from 'react';
import TopAppBar from './TopAppBar';
import LeftMenu from './LeftMenu';

const LeftMenuAndTopAppBar:React.FC = () => {
  const [isMenuOpen, setIsOpenMenu] = useState(true);

  const handleMenuOpen = ():void => {
    setIsOpenMenu(true);
  };

  const handleMenuClose = ():void => {
    setIsOpenMenu(false);
  };

  return (
    <>
      <TopAppBar
        isMenuOpen={isMenuOpen}
        handleMenuOpen={handleMenuOpen}
      />
      <LeftMenu
        isMenuOpen={isMenuOpen}
        handleMenuClose={handleMenuClose}
      />
    </>
  );
};

export default LeftMenuAndTopAppBar;


