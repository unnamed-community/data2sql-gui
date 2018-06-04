import fs from 'fs';
import path from 'path';
import { ipcRenderer as ipc } from 'electron';
import React from 'react';
import { Button } from 'reactstrap';
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
      exportOptions: {
        tableName: 'default',
        collation: 'utf8',
        output: null
      }
    }
  }

  componentWillMount() {
    ipc.on('selected-directory', (event, path) => {
      path = path[0];
      if (filesService.fileExists(path)) {
        const fileType = filesService.getFileType(path);
        if (fileType === 'CSV' || fileType === 'EXCEL') {
          const options = {
            separator: ';',
            sheet: ''
          }
          if (fileType === 'EXCEL') {
            //TODO: Prompt for sheet to open
          }
          filesService.getFileData(path, options)
            .then(file => {
              file.path = path;
              this.props.app.setState({ file })
            })
            .catch(error => {
              ipc.send('open-information-dialog', { type: 'error', message: `The content of ${path} can not be readed or the file does not contain data.` });
            });
        } else {
          ipc.send('open-information-dialog', { type: 'error', message: `The file ${path} must be on Excel or CSV format.` });
        }
      } else {
        ipc.send('open-information-dialog', { type: 'error', message: `The file ${path} does not exists.` });
      }
    });

    ipc.on('saved-file', (event, filepath) => {
      if (filepath) {
        if (!fs.existsSync(path.dirname(filepath))) {
          ipc.send('open-information-dialog', { type: 'error', message: `Select a correct path please.` });
        } else {
          try {
            fs.writeFileSync(filepath, this.state.output);
            ipc.send('open-information-dialog', { type: 'error', message: 'File exported successfully.' });
          } catch (error) {
            ipc.send('open-information-dialog', { type: 'error', message: `Can't save file in ${filepath}.` });
          }
        }
      }
    });
  }

  openFile = () => ipc.send('open-file-dialog');

  closeFile = () => this.props.app.setState({ file: null });

  exportToSQL = () => {
    let createTable = parserService.getCreateTable(this.props.app.state.file, this.state.exportOptions.tableName, this.state.exportOptions.collation);
    let insert = parserService.getInsert(this.props.app.state.file, this.state.exportOptions.tableName);
    this.setState({ output: `${createTable}${insert}` });
    ipc.send('save-dialog', { title: 'Export File', filters: { extensions: ['sql'] } });
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
        <Button outline color='info' onClick={this.openFile}>
          <Icon icon={folderOpen} /> Open File
        </Button>
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
