import React from 'react';
import './App.scss';
import { LocationHeader } from './components/LocationHeader/LocationHeader';
import { Title } from './components/Title/Title';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Title></Title>
          <LocationHeader></LocationHeader>
        </header>
      </div>
    );
  }
}

export default App;
