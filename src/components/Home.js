import React from 'react';
import { Grid, Divider } from 'semantic-ui-react';
import OpenFile from './OpenFile';
import App from './App';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
    };
  }

  renderApp = () => {
    if (!!this.state.file) {
      return (
        <Grid.Column verticalAlign="top">
          <Divider hidden />
          <App parent={this} />
        </Grid.Column>
      );
    } else {
      return (
        <Grid.Column verticalAlign="middle">
          <OpenFile parent={this} />
        </Grid.Column>
      );
    }
  };

  render() {
    return (
      <Grid container style={{ height: '100vh' }}>
        <Grid.Row>{this.renderApp()}</Grid.Row>
      </Grid>
    );
  }
}
