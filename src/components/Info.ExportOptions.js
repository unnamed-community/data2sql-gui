import React from 'react';
import { Container, Form, FormGroup, Col, Label, Input, CustomInput } from 'reactstrap';

export default class ExportOptions extends React.Component {
  constructor(props) {
    super(props);
  }

  changeTableName = (event) => {
    this.props.app.setState({
      tableName: event.target.value
    });
  }

  changeCollation = event => {
    this.props.app.setState({
      collation: event.target.value
    });
  }

  changeCreateTable = event => {
    this.props.app.setState({
      createTable: event.target.checked
    });
  }

  render() {
    return (
      <Container style={{ marginTop: 20 }}>
        <Form>
          <FormGroup row>
            <Label sm={2}>Table name:</Label>
            <Col sm='10'>
              <Input type='text' defaultValue={this.props.app.state.tableName} onChange={this.changeTableName} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2}>Collation:</Label>
            <Col sm='10'>
              <Input type='text' defaultValue={this.props.app.state.collation} onChange={this.changeCollation} />
            </Col>
          </FormGroup>
          <FormGroup>
            <div>
              <CustomInput
                type="checkbox"
                id='createTableCheck'
                checked={this.props.app.state.createTable}
                label="Add CREATE TABLE statement"
                onChange={this.changeCreateTable} />
            </div>
          </FormGroup>
        </Form>
      </Container>
    );
  }
}
