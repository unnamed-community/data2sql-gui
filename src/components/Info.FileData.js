import React from 'react';
import { Table } from 'reactstrap';

export default class FileData extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.file);
    return (
      <Table striped borderless hover responsive>
        <thead>
          <tr>
            <th>#</th>
            {this.props.file.headers.map((e, key) => (
              <th key={key}>{e}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {this.props.file.rows.map((e, key) => (
            <tr key={key}>
              <td scope='row'>{key + 1}</td>
              {e.map((el, i) => (
                <td key={i}>{el}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}
