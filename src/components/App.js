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
      <Container fluid>
        <Toolbar withFile={!!this.state.file} app={this} />
        <Info withFile={!!this.state.file} app={this} />
      </Container>
    );
  }
}
