import React from 'react';
import { GlobalConfigProvider } from './context/GlobalConfigContext';
import Routes from './Routes';

const App = (): React.ReactElement  => {
  return (
    <GlobalConfigProvider>
      <Routes />
    </GlobalConfigProvider>
  );
};

export default App;
