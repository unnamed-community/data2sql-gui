import React from 'react';
import { Container } from 'reactstrap';
import Toolbar from './Toolbar';
import Info from './Info';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null
    }
  }

  render() {
    return (
      <div>
        <Container fluid className='dark-background'>
          <Toolbar withFile={!!this.state.file} app={this} />
        </Container>
        <Info withFile={!!this.state.file} app={this} />
      </div>
    );
  }
}
