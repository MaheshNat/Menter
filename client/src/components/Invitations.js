import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadUser } from '../actions/authActions';
import {
  loadInvitations,
  cancelInvitation,
  denyInvitation,
  acceptInvitation,
  completeMeeting,
} from '../actions/invitationActions';
import { Tab, Tabs, Modal } from 'react-bootstrap';
import { StarRatingComponent } from 'react-star-rating-component';

class Invitations extends Component {
  state = {
    modalInvitation: null,
    rating: 0,
  };

  componentDidMount() {
    if (!this.props.isAuthenticated) this.props.history.push('/');
    this.props.setStatus(null);
    this.props.loadInvitations();
  }

  render() {
    console.log(this.props);
    return this.props.invitation.invitationsLoaded ? (
      <div>
        {this.state.modalInvitation && (
          <Modal
            show={this.state.modalInvitation !== null}
            onHide={() => {
              this.setState({ modalInvitation: null });
              this.props.setStatus(null);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Rate {this.state.modalInvitation.name}</Modal.Title>
            </Modal.Header>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!this.state.rating) return;
                this.setState({
                  modalInvitation: null,
                  rating: 0,
                });
                this.props.completeMeeting(
                  this.state.modalInvitation._id,
                  this.state.rating
                );
              }}
            >
              <Modal.Body>
                <div className="form-group">
                  <label htmlFor="rating">Rating</label>
                  <input
                    min="0"
                    max="5"
                    type="number"
                    className="form-control"
                    id="v"
                    onChange={(e) => {
                      this.setState({ rating: e.target.value });
                    }}
                  />
                </div>
              </Modal.Body>

              <Modal.Footer>
                <h4>{this.props.status}</h4>
                <button className="btn btn-primary" type="submit">
                  Rate
                </button>
              </Modal.Footer>
            </form>
          </Modal>
        )}

        <Tabs
          defaultActiveKey="incomingInvitations"
          style={{ marginTop: '2em' }}
        >
          <Tab eventKey="incomingInvitations" title="Incoming Invitations">
            <div className="container" style={{ marginTop: '2em' }}>
              <div className="row justify-content-center">
                <div className="col-xs-12">
                  <h3>{this.props.status ? this.props.status : ''}</h3>
                  {this.props.invitation.incomingInvitations.length === 0 ? (
                    <h3>No Incoming Invitations.</h3>
                  ) : (
                    this.props.invitation.incomingInvitations.map(
                      (incomingInvitation) => (
                        <div className="card" style={{ marginBottom: '1em' }}>
                          <div className="card-header">
                            {incomingInvitation.name}
                          </div>
                          <div className="card-body">
                            <h4 className="card-title">Subject</h4>
                            <p className="card-text">
                              {incomingInvitation.subject}
                            </p>
                            <h4 className="card-title">Type</h4>
                            <p className="card-text">
                              {incomingInvitation.type}
                            </p>
                            <button
                              className="btn btn-danger"
                              style={{ marginRight: '1em' }}
                              onClick={() => {
                                this.props.denyInvitation(
                                  incomingInvitation._id
                                );
                              }}
                            >
                              Deny Invitation
                            </button>
                            <button
                              className="btn btn-success"
                              onClick={() => {
                                this.props.acceptInvitation(
                                  incomingInvitation._id
                                );
                              }}
                            >
                              Accept Invitation
                            </button>
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            </div>
          </Tab>
          <Tab eventKey="outgoingInvitations" title="Outgoing Invitations">
            <div className="container" style={{ marginTop: '2em' }}>
              <div className="row justify-content-center">
                <div className="col-xs-12">
                  <h3>{this.props.status ? this.props.status : ''}</h3>
                  {this.props.invitation.outgoingInvitations.length === 0 ? (
                    <h3>No Outgoing Invitations.</h3>
                  ) : (
                    this.props.invitation.outgoingInvitations.map(
                      (outgoingInvitation) => (
                        <div className="card" style={{ marginBottom: '1em' }}>
                          <div className="card-header">
                            {outgoingInvitation.name}
                          </div>
                          <div className="card-body">
                            <h4 className="card-title">Subject</h4>
                            <p className="card-text">
                              {outgoingInvitation.subject}
                            </p>
                            <h4 className="card-title">Type</h4>
                            <p className="card-text">
                              {outgoingInvitation.type}
                            </p>
                            <button
                              className="btn btn-danger"
                              onClick={() => {
                                this.props.cancelInvitation(
                                  outgoingInvitation._id
                                );
                              }}
                            >
                              Cancel Invitation
                            </button>
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            </div>
          </Tab>
          <Tab eventKey="cancelledInvitations" title="Cancelled Invitations">
            <div className="container" style={{ marginTop: '2em' }}>
              <div className="row justify-content-center">
                <div className="col-xs-12">
                  <h3>{this.props.status ? this.props.status : ''}</h3>
                  {this.props.invitation.cancelledInvitations.length === 0 ? (
                    <h3>No Cancelled Invitations.</h3>
                  ) : (
                    this.props.invitation.cancelledInvitations.map(
                      (cancelledInvitation) => (
                        <div className="card" style={{ marginBottom: '1em' }}>
                          <div className="card-header">
                            {cancelledInvitation.name}
                          </div>
                          <div className="card-body">
                            <h4 className="card-title">Subject</h4>
                            <p className="card-text">
                              {cancelledInvitation.subject}
                            </p>
                            <h4 className="card-title">Type</h4>
                            <p className="card-text">
                              {cancelledInvitation.type}
                            </p>
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            </div>
          </Tab>
          <Tab eventKey="scheduledMeetings" title="Scheduled Meetings">
            <div className="container" style={{ marginTop: '2em' }}>
              <div className="row justify-content-center">
                <div className="col-xs-12">
                  <h3>{this.props.status ? this.props.status : ''}</h3>
                  {this.props.invitation.scheduledMeetings.length === 0 ? (
                    <h3>No Scheduled Meetings.</h3>
                  ) : (
                    this.props.invitation.scheduledMeetings.map(
                      (scheduledMeeting) => (
                        <div className="card" style={{ marginBottom: '1em' }}>
                          <div className="card-header">
                            {scheduledMeeting.name}
                          </div>
                          <div className="card-body">
                            <h4 className="card-title">Rating</h4>
                            <p className="card-text">
                              {scheduledMeeting.subject}
                            </p>
                            <h4 className="card-title">Type</h4>
                            <p className="card-text">{scheduledMeeting.type}</p>
                            <button
                              className="btn btn-success"
                              onClick={() => {
                                this.setState({
                                  modalInvitation: scheduledMeeting,
                                });
                              }}
                            >
                              Completed
                            </button>
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            </div>
          </Tab>
          <Tab eventKey="completedMeetings" title="Completed Meetings">
            <div className="container" style={{ marginTop: '2em' }}>
              <div className="row justify-content-center">
                <div className="col-xs-12">
                  <h3>{this.props.status ? this.props.status : ''}</h3>
                  {this.props.invitation.completedMeetings.length === 0 ? (
                    <h3>No Completed Meetings.</h3>
                  ) : (
                    this.props.invitation.completedMeetings.map(
                      (completedMeeting) => (
                        <div className="card" style={{ marginBottom: '1em' }}>
                          <div className="card-header">
                            {completedMeeting.name}
                          </div>
                          <div className="card-body">
                            <h4 className="card-title">Subject</h4>
                            <p className="card-text">
                              {completedMeeting.subject}
                            </p>
                            <h4 className="card-title">Type</h4>
                            <p className="card-text">{completedMeeting.type}</p>
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    ) : (
      <div className="row justify-content-center" style={{ marginTop: '2em' }}>
        <div className="col text-center">
          <div
            className="spinner-border"
            style={{ width: '5em', height: '5em' }}
            role="status"
          ></div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    invitation: state.invitation,
    status: state.invitation.status,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    loadUser: () => {
      dispatch(loadUser());
    },
    loadInvitations: () => {
      dispatch(loadInvitations());
    },
    cancelInvitation: (id) => {
      dispatch(cancelInvitation(id));
    },
    denyInvitation: (id) => {
      dispatch(denyInvitation(id));
    },
    acceptInvitation: (id) => {
      dispatch(acceptInvitation(id));
    },
    completeMeeting: (id, rating) => {
      dispatch(completeMeeting(id, rating));
    },
    setStatus: (status) => {
      dispatch({ type: 'SET_STATUS', status: status });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Invitations);
