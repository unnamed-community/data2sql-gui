import React from 'react';
import classnames from 'classnames';
import { Container, TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import FileData from './Info.FileData';
import ExportOptions from './Info.ExportOptions';
import { Icon } from 'react-icons-kit';
import { fileO } from 'react-icons-kit/fa/fileO';

export default class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: '1'
    }
  }

  toggleTab = (tab) => () => {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  }

  renderInfo = () => {
    if (this.props.withFile) {
      return (
        <div>
          <Nav tabs className='dark-background'>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '1' })}
                onClick={this.toggleTab('1')}
              >
                File Data
            </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '2' })}
                onClick={this.toggleTab('2')}
              >
                Export Properties
            </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <FileData file={this.props.app.state.file} />
            </TabPane>
            <TabPane tabId="2">
              <ExportOptions app={this.props.app} />
            </TabPane>
          </TabContent>
        </div>
      );
    } else {
      return (
        <Container fluid className='home-icon'>
          <Icon size={128} icon={fileO} />
          <p>Open a file to start</p>
        </Container>
      );
    }
  }

  render() {
    return (
      <div className='text-center'>
        {this.renderInfo()}
      </div>
    );
  }
}
