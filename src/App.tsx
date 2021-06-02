import React from 'react';
import { Row } from 'react-bootstrap';

import { Subscription } from 'rxjs';

import './App.scss';
import { HUD } from './components/HUD/HUD';
import { Intro } from './components/Intro/Intro';
import { LocationHeader } from './components/LocationHeader/LocationHeader';
import { StartMenu } from './components/Menu/StartMenu/StartMenu';
import { PortMain } from './components/Port/PortMain/PortMain';
import { Title } from './components/Title/Title';
import { gameManager, GameState } from './services/GameManager';
import { SceneLocation } from './Types/SceneLocation';

interface Props {}

interface State {
  gameState: GameState;
  sceneLocation: SceneLocation;
}

class App extends React.Component<Props, State> {
  private subscriptions: Subscription[] = [];

  constructor(props: Props) {
      super(props);

      this.state = {
          gameState: GameState.Start,
          sceneLocation: SceneLocation.Port,
      };
  }
  
  public componentDidMount() {
      // subscribe to all relevant player HUD data
      this.subscriptions.push(
          gameManager.getGameState().subscribe(gameState => {
            this.setState({ gameState: gameState });
          }),
          gameManager.getSceneLocation().subscribe(location => {
            if (location) {
                // add balance to local state if number
                this.setState({ sceneLocation: location });
            }
          })
      );
  }

  public componentWillUnmount() {
      // unsubscribe to ensure no memory leaks
      this.subscriptions.filter(s => s).forEach(s => s.unsubscribe());
      this.subscriptions.length = 0;
  }

  public render() {
    const { gameState, sceneLocation } = this.state;
    return (
      <div className="App text-center">
        <Row>
          <Title></Title>
        </Row>
        { gameState !== GameState.Start ? null :
          <Row>
            <StartMenu></StartMenu>
          </Row>
        }
        { gameState !== GameState.Intro ? null :
          <Row>
            <Intro></Intro>
          </Row>
        }
        { gameState !== GameState.Active ? null :
          <>
            <Row>
              <LocationHeader></LocationHeader>
            </Row>
            <Row>
              <HUD></HUD>
            </Row>
            { sceneLocation !== SceneLocation.Port ? null :
              <Row>
                <PortMain></PortMain>
              </Row>
            }
          </>
        }
      </div>
    );
  }
}

export default App;
