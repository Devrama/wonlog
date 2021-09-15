import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Homepage from './pages/Homepage';
import DefaultTemplate from './templates/default';

const Routes:React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <DefaultTemplate contentComponent={Homepage} />
        </Route>
        <Route path="/*">
          <div>404 Not Found</div>
        </Route>
      </Switch>
    </Router>
  );
};

export default Routes;
