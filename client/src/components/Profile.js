import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadUser } from '../actions/authActions';
import StarRatingComponent from 'react-star-rating-component';

class Profile extends Component {
  componentDidMount() {
    if (!this.props.isAuthenticated) this.props.history.push('/');
    this.props.loadUser();
  }

  render() {
    return this.props.fullyLoaded ? (
      <div>
        <div className="jumbotron text-center" style={{ marginTop: '2em' }}>
          <h1>
            {this.props.user.firstName} {this.props.user.lastName}
          </h1>
          {this.props.user.rating ? (
            <StarRatingComponent
              name="rate2"
              editing={false}
              starCount={5}
              value={this.props.user.rating}
            />
          ) : (
            <h4>No Rating.</h4>
          )}
          {this.props.user.ratings > 0 ? (
            <h5> {this.props.user.ratings} Rating(s)</h5>
          ) : null}
          <div className="row justify-content-center">
            <div className="col-xs-12 col-sm-6">
              <h3>Age: {this.props.user.age}</h3>
              <h3>Grade: {this.props.user.grade}</h3>
              <h3>Biography</h3>
              <p>{this.props.user.biography}</p>
              <h3>Contact Information</h3>
              <p>Email: {this.props.user.email}</p>
            </div>
            <div className="col-xs-12 col-sm-6">
              <h3>Skills</h3>
              {this.props.user.skills.map((skill) => (
                <span
                  key={skill.subject}
                  className="badge badge-pill badge-primary"
                  style={{
                    marginBottom: '0.5em',
                    marginRight: '0.5em',
                  }}
                >
                  {skill.subject}
                </span>
              ))}
              <h3>Courses</h3>
              {this.props.user.courses.map((course) => (
                <span
                  key={course}
                  className="badge badge-pill badge-success"
                  style={{
                    marginBottom: '0.5em',
                    marginRight: '0.5em',
                  }}
                >
                  {course}
                </span>
              ))}
              <h3>Skills Needed</h3>
              {this.props.user.needSkills.map((needSkill) => (
                <span
                  key={needSkill}
                  className="badge badge-pill badge-warning"
                  style={{
                    marginBottom: '0.5em',
                    marginRight: '0.5em',
                  }}
                >
                  {needSkill}
                </span>
              ))}
              <h3>Stats</h3>
              <h4>
                Completed Meetings:{' '}
                {this.props.user.completedMeetings
                  ? this.props.user.completedMeetings.length
                  : 0}
              </h4>
              <h4>
                Scheduled Meetings:{' '}
                {this.props.user.scheduleMeetings
                  ? this.props.user.scheduleMeetings.length
                  : 0}
              </h4>
              <h4>
                Cancelled Invitations:{' '}
                {this.props.user.cancelledInvitations
                  ? this.props.user.cancelledInvitations.length
                  : 0}
              </h4>
            </div>
          </div>
        </div>
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
    fullyLoaded: state.auth.fullyLoaded,
    user: state.auth.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    loadUser: () => {
      dispatch(loadUser());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
