import React, { useMemo, ReactElement } from 'react';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {
  Darkmode,
  useDarkmode,
} from 'src/context/DarkmodeContext';

const TopAppBarDarkmode:React.FC = () => {
  const { darkmode, setDarkmode } = useDarkmode();

  const component = useMemo<ReactElement>(
    () => {
      return (
        <>
          <ToggleButtonGroup
            value={darkmode}
            exclusive
            onChange={(event, mode): void => {
              if(mode) {
                setDarkmode(mode);
              }
            }}
            aria-label="text alignment"
          >
            <ToggleButton value={Darkmode.DARK} aria-label={Darkmode.DARK}>
              <Brightness2Icon />
            </ToggleButton>
            <ToggleButton value={Darkmode.LIGHT} aria-label={Darkmode.LIGHT}>
              <Brightness5Icon />
            </ToggleButton>
          </ToggleButtonGroup>
        </>
      );
    },
    [darkmode]
  );

  return component;
};

export default TopAppBarDarkmode;
