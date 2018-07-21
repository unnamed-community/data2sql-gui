import fs from 'fs';
import { ipcRenderer as ipc } from 'electron';
import React, { Component } from 'react';
import {
  Container,
  Header,
  Icon,
  Button,
  Card,
  Input,
  Dropdown,
} from 'semantic-ui-react';
import filesService from '../services/files';

const initialState = {
  filepath: null,
  separator: ';',
  sheet: null,
};

export default class OpenFile extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    ipc.on('selected-directory', (event, filepath) => {
      filepath = filepath[0];
      if (!fs.existsSync(filepath)) {
        ipc.send('open-information-dialog', {
          type: 'error',
          message: __('error_file_does_not_exists', filepath),
        });
      } else {
        const fileType = filesService.getFileType(filepath);
        if (fileType === 'CSV' || fileType === 'EXCEL') {
          this.setState({ filepath });
        } else {
          ipc.send('open-information-dialog', {
            type: 'error',
            message: __('error_invalid_format', filepath),
          });
        }
      }
    });
  }

  componentWillUnmount() {
    ipc.removeAllListeners('selected-directory');
  }

  openFile = () => ipc.send('open-file-dialog');

  renderInfo = () => {
    return (
      <Container>
        <Header as="h2" icon>
          <Icon name="file outline" />
          {__('letsgo')}
          <Header.Subheader>{__('letsgo_description')}</Header.Subheader>
        </Header>
        {this.renderForm()}
      </Container>
    );
  };

  handleBack = () => this.setState(initialState);

  handleContinue = () => {
    filesService
      .getFileData(this.state.filepath, {
        separator: this.state.separator,
        sheet: this.state.sheet,
      })
      .then(file => {
        file.path = this.state.filepath;
        this.props.parent.setState({ file });
      })
      .catch(error => {
        ipc.send('open-information-dialog', {
          type: 'error',
          message: __('error_cant_be_readed', this.state.filepath),
        });
      });
  };

  renderForm = () => {
    if (this.state.filepath) {
      let type = filesService.getFileType(this.state.filepath);
      let disabled = true;
      if (type === 'CSV') {
        disabled = this.state.separator === '';
      } else if (type === 'EXCEL') {
        disabled = !this.state.sheet;
      }
      return (
        <Card centered color="blue">
          <Card.Content>{this.renderInput()}</Card.Content>
          <Button.Group attached="bottom">
            <Button onClick={this.handleBack}>{__('back')}</Button>
            <Button
              color="green"
              disabled={disabled}
              onClick={this.handleContinue}
            >
              {__('continue')}
            </Button>
          </Button.Group>
        </Card>
      );
    } else {
      return (
        <div>
          <Button
            icon
            inverted
            color="blue"
            labelPosition="right"
            className="space-top"
            onClick={this.openFile}
          >
            {__('open_file')}
            <Icon name="folder open outline" />
          </Button>
        </div>
      );
    }
  };

  onChangeSheet = (event, sheet) => {
    const { value } = sheet;
    this.setState({ sheet: value });
  };

  onChangeSeparator = (event, data) => {
    const { value } = data;
    this.setState({ separator: value });
  };

  renderInput = () => {
    const type = filesService.getFileType(this.state.filepath);
    if (type === 'CSV') {
      return (
        <Input
          label={__('separator')}
          defaultValue={this.state.separator}
          onChange={this.onChangeSeparator}
        />
      );
    } else if (type === 'EXCEL') {
      let sheets = filesService.getExcelSheets(this.state.filepath);
      sheets = sheets.map(e => ({ key: e, value: e, text: e }));

      return (
        <Dropdown
          placeholder={__('sheet')}
          search
          selection
          options={sheets}
          onChange={this.onChangeSheet}
        />
      );
    }
  };

  render() {
    return <Container textAlign="center">{this.renderInfo()}</Container>;
  }
}
