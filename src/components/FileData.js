import React, { Component } from 'react';
import { Container, Divider, Table } from 'semantic-ui-react';

export default class FileData extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Divider hidden />
        <Table striped compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>#</Table.HeaderCell>
              {this.props.file.headers.map((e, i) => (
                <Table.HeaderCell key={i}>{e}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.props.file.rows.map((e, i) => (
              <Table.Row key={i}>
                <Table.Cell>{i + 1}</Table.Cell>
                {e.map((el, j) => <Table.Cell key={j}>{el}</Table.Cell>)}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Container>
    );
  }
}
