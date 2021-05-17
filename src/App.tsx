import React from 'react';
import logo from './logo.svg';
import './App.css';
import { LocationHeader } from './components/LocationHeader';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <LocationHeader></LocationHeader>
      </header>
    </div>
  );
}

export default App;
