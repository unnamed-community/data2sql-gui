import fs from 'fs';
import path from 'path';
import { ipcRenderer as ipc } from 'electron';
import React from 'react';
import { Button, Popover, PopoverBody, InputGroup, InputGroupAddon, Input, InputGroupText, Label } from 'reactstrap';
import { Icon } from 'react-icons-kit';
import { folderOpen } from 'react-icons-kit/fa/folderOpen';
import { remove } from 'react-icons-kit/fa/remove';
import { save } from 'react-icons-kit/fa/save';
import filesService from '../services/files';
import parserService from '../services/parser';

export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverOpen: false,
      DropdownMenu: false,
      filepath: '',
      fileOptions: {
        sheet: '',
        separator: ';'
      }
    }
  }

  componentWillMount() {
    ipc.on('selected-directory', (event, filepath) => {
      filepath = filepath[0];
      if (!fs.existsSync(filepath)) {
        ipc.send('open-information-dialog', { type: 'error', message: `The file ${filepath} does not exists.` });
      } else {
        const fileType = filesService.getFileType(filepath);
        if (fileType === 'CSV' || fileType === 'EXCEL') {
          this.setState({
            filepath,
            fileOptions: {
              separator: ';',
              sheet: ''
            }
          });
        } else {
          ipc.send('open-information-dialog', { type: 'error', message: `The file ${filepath} must be on Excel or CSV format.` });
        }
      }
    });

    ipc.on('saved-file', (event, filepath) => {
      if (filepath) {
        if (!fs.existsSync(path.dirname(filepath))) {
          ipc.send('open-information-dialog', { type: 'error', message: `Select a correct path please.` });
        } else {
          try {
            fs.writeFileSync(filepath, this.state.output);
            ipc.send('open-information-dialog', { message: 'File exported successfully.' });
          } catch (error) {
            ipc.send('open-information-dialog', { type: 'error', message: `Can't save file in ${filepath}.` });
          }
        }
      }
    });
  }

  getData = () => {
    this.setState({ popoverOpen: false });
    filesService.getFileData(this.state.filepath, this.state.fileOptions)
      .then(file => {
        file.path = this.state.filepath;
        this.props.app.setState({ file });
      })
      .catch(error => {
        ipc.send('open-information-dialog', { type: 'error', message: `The content of ${this.state.filepath} can not be readed or the file does not contain data.` });
      });
  }

  toggleDropDown = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  togglePopover = () => this.setState({ popoverOpen: !this.state.popoverOpen })

  openFile = () => ipc.send('open-file-dialog');

  closeFile = () => this.props.app.setState({ file: null });

  exportToSQL = () => {
    let createTable = '';
    if (this.props.app.state.createTable) {
      createTable = parserService.getCreateTable(
        this.props.app.state.file,
        this.props.app.state.tableName,
        this.props.app.state.collation);
    }
    let insert = parserService.getInsert(this.props.app.state.file, this.props.app.state.tableName);
    this.setState({ output: `${createTable}${insert}` });
    ipc.send('save-dialog', { title: 'Export File', filters: { extensions: ['sql'] } });
  }

  changeSeparator = event => (this.setState({
    fileOptions: {
      separator: event.target.value
    }
  }));

  changeSheet = event => {
    this.setState({
      fileOptions: {
        sheet: event.target.value
      }
    });
  }

  renderFileOptions = () => {
    if (this.state.filepath !== '') {
      const type = filesService.getFileType(this.state.filepath);
      if (type === 'CSV') {
        return (
          <InputGroup style={{ marginBottom: 5 }}>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Separator</InputGroupText>
            </InputGroupAddon>
            <Input defaultValue={this.state.fileOptions.separator} onChange={this.changeSeparator} />
          </InputGroup>
        );
      } else if (type === 'EXCEL') {
        const sheets = filesService.getExcelSheets(this.state.filepath);
        sheets.unshift('');
        return (
          <div style={{ marginBottom: 5 }}>
            <Label>Select a sheet:</Label>
            <Input type='select' onChange={this.changeSheet}>
              {sheets.map((e, i) => (<option key={i}>{e}</option>))}
            </Input>
          </div>
        );
      } else {
        return '';
      }
    }
  }

  renderGetDataButton = () => {
    if (this.state.filepath !== '') {
      let type = filesService.getFileType(this.state.filepath);
      let disabled = true;
      if (type === 'CSV') {
        disabled = this.state.fileOptions.separator === '';
      } else if (type === 'EXCEL') {
        disabled = this.state.fileOptions.sheet === '';
      }

      return (
        <Button
          disabled={disabled}
          block
          size='lg'
          color='success'
          onClick={this.getData}>
          GET DATA
      </Button>
      );
    }
  }

  renderToolbar = () => {
    if (this.props.withFile) {
      return (
        <div>
          <Button outline color='danger' onClick={this.closeFile} style={{ marginRight: 10 }}>
            <Icon icon={remove} /> Close File
          </Button>
          <Button outline color='info' onClick={this.exportToSQL}>
            <Icon icon={save} /> Export to SQL
          </Button>
        </div>
      );
    } else {
      return (
        <div>
          <Button outline color='info' id='openFile' onClick={this.togglePopover}>
            <Icon icon={folderOpen} /> Open File
          </Button>
          <Popover placement='bottom' isOpen={this.state.popoverOpen} target="openFile" toggle={this.togglePopover}>
            <PopoverBody>
              <InputGroup style={{ marginBottom: 5 }}>
                <InputGroupAddon addonType="prepend">
                  <Button outline color="secondary" onClick={this.openFile}>Choose File</Button>
                </InputGroupAddon>
                <Input readOnly value={this.state.filepath} />
              </InputGroup>
              {this.renderFileOptions()}
              {this.renderGetDataButton()}
            </PopoverBody>
          </Popover>
        </div>
      );
    }
  }

  render() {
    return (
      <div className='separate-border'>
        {this.renderToolbar()}
      </div>
    );
  }
}
