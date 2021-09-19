import React from 'react';
import { DarkmodeProvider } from './context/DarkmodeContext';
import Routes from './Routes';

const App = (): React.ReactElement  => {
  return (
    <DarkmodeProvider>
      <Routes />
    </DarkmodeProvider>
  );
};

export default App;
