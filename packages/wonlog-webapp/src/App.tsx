import React from 'react';
import { GlobalConfigProvider } from './context/GlobalConfigContext';
import DefaultTemplate from './templates/default';

const App = (): React.ReactElement  => {
  return (
    <GlobalConfigProvider>
      <DefaultTemplate />
    </GlobalConfigProvider>
  );
};

export default App;
