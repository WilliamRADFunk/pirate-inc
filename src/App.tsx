import React from 'react';

import { Subscription } from 'rxjs';

import './App.scss';
import { HUD } from './components/HUD/HUD';
import { Intro } from './components/Intro/Intro';
import { LocationHeader } from './components/LocationHeader/LocationHeader';
import { StartMenu } from './components/Menu/StartMenu/StartMenu';
import { Title } from './components/Title/Title';
import { gameManager, GameState } from './services/GameManager';

interface Props {}

interface State {
  gameState: GameState;
}

class App extends React.Component<Props, State> {
  private subscriptions: Subscription[] = [];

  constructor(props: Props) {
      super(props);

      this.state = {
          gameState: GameState.Start,
      };
  }
  
  public componentDidMount() {
      // subscribe to all relevant player HUD data
      this.subscriptions.push(
          gameManager.getGameState().subscribe(gameState => {
            this.setState({ gameState: gameState });
          }),
      );
  }

  public componentWillUnmount() {
      // unsubscribe to ensure no memory leaks
      this.subscriptions.filter(s => s).forEach(s => s.unsubscribe());
      this.subscriptions.length = 0;
  }

  public render() {
    const { gameState } = this.state;
    return (
      <div className="App text-center">
        <div className="row">
          <Title></Title>
        </div>
        { gameState !== GameState.Start ? null :
          <div className="row">
            <StartMenu></StartMenu>
          </div>
        }
        { gameState !== GameState.Intro ? null :
          <div className="row">
            <Intro></Intro>
          </div>
        }
        { gameState !== GameState.Active ? null :
          <>
            <div className="row">
              <LocationHeader></LocationHeader>
            </div>
            <div className="row">
              <HUD></HUD>
            </div>
          </>
        }
      </div>
    );
  }
}

export default App;
