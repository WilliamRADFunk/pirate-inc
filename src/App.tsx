import React from 'react';
import { Row } from 'react-bootstrap';

import { Subscription } from 'rxjs';

import './App.scss';
import { HUD } from './Components/HUD/HUD';
import { Intro } from './Components/Intro/Intro';
import { StartMenu } from './Components/Menu/StartMenu/StartMenu';
import { PortMain } from './Components/Port/PortMain/PortMain';
import { Title } from './Components/Title/Title';
import { GameState, SceneState, stateManager } from './Services/StateManager';

interface Props {}

interface State {
  gameState: GameState;
  sceneState: SceneState;
}

class App extends React.Component<Props, State> {
  private subscriptions: Subscription[] = [];

  constructor(props: Props) {
      super(props);

      this.state = {
          gameState: GameState.Start,
          sceneState: SceneState.Port,
      };
  }
  
  public componentDidMount(): void {
      // subscribe to all relevant player HUD data
      this.subscriptions.push(
        stateManager.getGameState().subscribe(gameState => {
            this.setState({ gameState: gameState });
          }),
          stateManager.getSceneState().subscribe(state => {
            if (state) {
                // add balance to local state if number
                this.setState({ sceneState: state });
            }
          })
      );
  }

  public componentWillUnmount(): void {
      // unsubscribe to ensure no memory leaks
      this.subscriptions.filter(s => s).forEach(s => s.unsubscribe());
      this.subscriptions.length = 0;
  }

  /**
   * The render function to run each time there is a state change.
   * @returns Jsx Element representing the DOM of the component.
   */
  public render(): any {
    const { gameState, sceneState } = this.state;
    return (
      <div className="App text-center port-bg-01 h-100 full-view-height">
        <Row className='no-gutters'>
          <Title></Title>
        </Row>
        { gameState !== GameState.Start ? null :
          <Row className='no-gutters'>
            <StartMenu></StartMenu>
          </Row>
        }
        { gameState !== GameState.Intro ? null :
          <Row className='no-gutters'>
            <Intro></Intro>
          </Row>
        }
        { gameState !== GameState.Active ? null :
          <>
            <Row className='no-gutters'>
              <HUD></HUD>
            </Row>
            { sceneState !== SceneState.Port ? null :
              <Row className='no-gutters'>
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
