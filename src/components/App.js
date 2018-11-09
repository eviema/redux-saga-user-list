import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Alert} from 'reactstrap';
import {getUsersRequest, createUserRequest, deleteUserRequest, usersError} from '../actions/users';
import UserList from './UserList';
import NewUserForm from './NewUserForm';

class App extends Component {
  constructor(props) {
    super(props);

    this.props.getUsersRequest();
  }

  handleSubmit = ({firstName, lastName}) => {
    this.props.createUserRequest({
      firstName,
      lastName
    });
  }

  handleDeleteUserClick = (userId) => {
    this.props.deleteUserRequest(userId);
  };

  handleCloseAlert = () => {
    this.props.usersError({
      error: ''
    });
  };

  render() {
    const users = this.props.users;
    return (
      <div style={{margin: '0 auto', padding: '20px', maxWidth: '600px'}}>
        <Alert color="danger" isOpen={!!this.props.users.error} toggle={this.handleCloseAlert}>
          {this.props.users.error}
        </Alert>
        <NewUserForm onSubmit={this.handleSubmit} />
        <UserList users={users.items} onDeleteUser={this.handleDeleteUserClick}/>
      </div>
    );
  }
}

export default connect(({users}) => ({users}), { // map state to props
  getUsersRequest,  // map dispatch to props
  createUserRequest,
  deleteUserRequest,
  usersError
})(App);
