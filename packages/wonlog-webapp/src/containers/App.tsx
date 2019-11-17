import React from 'react';
import logo from '../resources/images/logo.svg';
import './App.css';
import MainBody from './main_body/MainBody';
import Sidebar from './sidebar/Sidebar';
import HeaderNavigation from './header_navigation/HeaderNavigation';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Wonlog, Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <HeaderNavigation />
      <MainBody />
      <Sidebar />
    </div>
  );
}

export default App;
