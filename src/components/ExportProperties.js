import path from 'path';
import fs from 'fs';
import { ipcRenderer as ipc } from 'electron';
import React, { Component } from 'react';
import {
  Input,
  Container,
  Checkbox,
  Button,
  Divider,
  Icon,
} from 'semantic-ui-react';
import parserService from '../services/parser';

export default class ExportProperties extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableName: 'default',
      collation: 'utf8',
      addCreateTable: true,
      output: null,
    };
  }

  componentDidMount() {
    ipc.on('saved-file', (event, filepath) => {
      if (filepath) {
        if (!fs.existsSync(path.dirname(filepath))) {
          ipc.send('open-information-dialog', {
            type: 'error',
            message: __('error_incorrect_path'),
          });
        } else {
          try {
            fs.writeFileSync(filepath, this.state.output);
            ipc.send('open-information-dialog', {
              message: __('msg_file_saved'),
            });
          } catch (error) {
            ipc.send('open-information-dialog', {
              type: 'error',
              message: __('error_cant_save', filepath),
            });
          }
        }
      }
    });
  }

  componentWillUnmount() {
    ipc.removeAllListeners('saved-file');
  }

  onChangeCreateTable = () => {
    this.setState(prev => ({
      addCreateTable: !prev.addCreateTable,
    }));
  };

  onChangeTableName = (event, data) => {
    const { value } = data;
    this.setState({ tableName: value });
  };

  onChangeCollation = (event, data) => {
    const { value } = data;
    this.setState({ collation: value });
  };

  handleExport = () => {
    let createTable = '';
    if (this.state.addCreateTable) {
      createTable = parserService.getCreateTable(
        this.props.parent.props.parent.state.file,
        this.state.tableName,
        this.state.collation
      );
    }
    let insert = parserService.getInsert(
      this.props.parent.props.parent.state.file,
      this.state.tableName
    );
    this.setState({ output: `${createTable}${insert}` });
    ipc.send('save-dialog', {
      title: __('export_file'),
      filters: { extensions: ['sql'] },
    });
  };

  handleCancel = () => this.props.parent.props.parent.setState({ file: null });

  render() {
    return (
      <Container style={{ width: '80%' }}>
        <Divider hidden />
        <b>{__('table_name')}</b>
        <Input
          fluid
          defaultValue={this.state.tableName}
          onChange={this.onChangeTableName}
        />
        <Divider hidden />
        <b>{__('collation')}</b>
        <Input
          fluid
          defaultValue={this.state.collation}
          onChange={this.onChangeCollation}
        />
        <Divider hidden />
        <Checkbox
          toggle
          checked={this.state.addCreateTable}
          onChange={this.onChangeCreateTable}
          label={__('add_create_table')}
        />
        <Divider hidden />
        <Button
          icon
          inverted
          color="green"
          labelPosition="right"
          disabled={!this.state.tableName || !this.state.collation}
          onClick={this.handleExport}
        >
          {__('export')}
          <Icon name="save outline" />
        </Button>
        <Button
          icon
          inverted
          color="red"
          labelPosition="right"
          onClick={this.handleCancel}
        >
          {__('back')}
          <Icon name="cancel" />
        </Button>
        <Divider hidden />
      </Container>
    );
  }
}
