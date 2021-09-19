import React, { createContext, useState, useContext } from 'react';

const LOCAL_STORAGE = {
  DARK_MODE: 'wonlog.darkmode',
};

export enum Darkmode {
  LIGHT = 'light',
  DARK = 'dark',
}

interface DarkmodeType {
  darkmode: Darkmode;
  setDarkmode: (mode: Darkmode) => void;
}

const DarkmodeContext = createContext<DarkmodeType>({
  darkmode: Darkmode.DARK,
  setDarkmode: (): void => {
    // noop
  },
});

const DarkmodeProvider:React.FC = props => {
  const [ darkmode, setDarkmode ] = useState<Darkmode>((window.localStorage.getItem(LOCAL_STORAGE.DARK_MODE) ?? Darkmode.LIGHT) as Darkmode);

  return (
    <DarkmodeContext.Provider value={{ darkmode, setDarkmode }}>
      {props.children}
    </DarkmodeContext.Provider>
  );
};

const DarkmodeConsumer = DarkmodeContext.Consumer;

const useDarkmode = (): DarkmodeType => {
  const { darkmode, setDarkmode } = useContext(DarkmodeContext);

  return {
    darkmode,
    setDarkmode: (mode: Darkmode): void => {
      setDarkmode(mode);
      window.localStorage.setItem(LOCAL_STORAGE.DARK_MODE, mode);
    },
  };
};

export {
  DarkmodeContext,
  DarkmodeProvider,
  DarkmodeConsumer,
  useDarkmode,
};
