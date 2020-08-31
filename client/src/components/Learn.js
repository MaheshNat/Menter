import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadUsers } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import { sendInvitation } from '../actions/invitationActions';
import StarRatingComponent from 'react-star-rating-component';
import { Modal } from 'react-bootstrap';

class Learn extends Component {
  state = {
    modalUser: null,
    subject: null,
  };

  componentDidMount() {
    if (!this.props.isAuthenticated) this.props.history.push('/');
    this.props.setStatus(null);
    this.props.loadUsers('learn');
  }

  render() {
    console.log(this.props);
    return (
      <>
        <Modal
          show={this.state.modalUser !== null}
          onHide={() => {
            this.setState({ modalUser: null });
            this.props.clearErrors();
            this.props.setStatus(null);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {this.state.modalUser &&
                `Invite ${this.state.modalUser.firstName} ${this.state.modalUser.lastName} To Teach You`}
            </Modal.Title>
          </Modal.Header>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!this.state.subject) return;
              this.props.sendInvite(
                this.state.subject,
                this.state.modalUser._id
              );
            }}
          >
            <Modal.Body>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  className="form-control"
                  id="subject"
                  onChange={(e) => {
                    this.setState({ subject: e.target.value });
                  }}
                />
              </div>
            </Modal.Body>

            <Modal.Footer>
              <h4>
                {this.props.error.msg !== {} && this.props.error.msg.message}
                {this.props.status}
              </h4>
              <button className="btn btn-primary" type="submit">
                Invite
              </button>
            </Modal.Footer>
          </form>
        </Modal>
        <div>
          <div className="jumbotron text-center" style={{ marginTop: '2em' }}>
            <h1>Learn valuable skills from people who know them.</h1>
          </div>
        </div>
        {!this.props.users ? (
          <div
            className="row justify-content-center"
            style={{ marginTop: '2em' }}
          >
            <div className="col text-center">
              <div
                className="spinner-border"
                style={{ width: '5em', height: '5em' }}
                role="status"
              ></div>
            </div>
          </div>
        ) : (
          <div className="row justify-content-center">
            {this.props.users.map((user) => (
              <div className="col-xs-12 col-sm-6" key={user._id}>
                <div className="card" style={{ margin: '1em' }}>
                  <div className="card-body">
                    <h5 className="card-title">
                      {user.firstName} {user.lastName} | Age {user.age} | Grade{' '}
                      {user.grade}
                    </h5>
                    <div className="row justify-content-center">
                      <div className="col-6">
                        {user.rating ? (
                          <StarRatingComponent
                            name="rate2"
                            editing={false}
                            starCount={5}
                            value={user.rating}
                          />
                        ) : (
                          <p>No Rating.</p>
                        )}
                        {user.biography ? (
                          <p className="card-text">
                            {user.biography.length > 30
                              ? user.biography.substring(0, 30) + '...'
                              : user.biography}
                          </p>
                        ) : (
                          <p>No Biography.</p>
                        )}
                        <button
                          onClick={() => {
                            this.setState({ modalUser: user });
                          }}
                          className="btn btn-success"
                        >
                          Invite To Learn
                        </button>
                      </div>
                      <div className="col-6">
                        <h5>Skills</h5>
                        {user.skills.map((skill) => (
                          <span
                            key={skill.subject}
                            className="badge badge-pill badge-success"
                            style={{
                              marginBottom: '0.5em',
                              marginRight: '0.5em',
                            }}
                          >
                            {skill.subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    users: state.auth.users,
    usersLoading: state.auth.usersLoading,
    status: state.invitation.status,
    error: state.error,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    loadUsers: (type) => {
      dispatch(loadUsers(type));
    },
    sendInvite: (subject, userId) => {
      dispatch(sendInvitation(subject, userId, 'learn'));
    },
    setStatus: (status) => {
      dispatch({ type: 'SET_STATUS', status: status });
    },
    clearErrors: (status) => {
      dispatch(clearErrors());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Learn);
