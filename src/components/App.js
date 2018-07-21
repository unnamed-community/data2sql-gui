import React, { Component } from 'react';
import { Tab, Container } from 'semantic-ui-react';
import ExportProperties from './ExportProperties';
import FileData from './FileData';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  getTabs = () => {
    return [
      {
        menuItem: __('export_properties'),
        render: () => (
          <Tab.Pane style={{ height: '100%' }}>
            <ExportProperties parent={this} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: __('file_data'),
        render: () => (
          <Tab.Pane style={{ height: '100%' }}>
            <FileData file={this.props.parent.state.file} parent={this} />
          </Tab.Pane>
        ),
      },
    ];
  };

  render() {
    return <Tab panes={this.getTabs()} />;
  }
}
