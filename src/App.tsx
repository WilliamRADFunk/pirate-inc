import React from 'react';
import './App.scss';
import { HUD } from './components/HUD/HUD';
import { LocationHeader } from './components/LocationHeader/LocationHeader';
import { Title } from './components/Title/Title';

class App extends React.Component {
  render() {
    return (
      <div className="App text-center">
        <div className="row">
          <Title></Title>
        </div>
        <div className="row">
          <LocationHeader></LocationHeader>
        </div>
        <div className="row">
          <HUD></HUD>
        </div>
      </div>
    );
  }
}

export default App;
